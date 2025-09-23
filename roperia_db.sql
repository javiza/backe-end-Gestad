CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]{1}$'),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- aquí guardamos hash bcrypt
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'usuario')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda rápida de emails
CREATE INDEX idx_usuarios_email ON usuarios(email);


-- TABLA LAVANDERIAS

CREATE TABLE lavanderias (
    id_lavanderia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(12) unique NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]{1}$'),
    telefono VARCHAR(20)
);


-- TABLA REPROCESOS

CREATE TABLE reprocesos (
    id_reproceso SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    responsable VARCHAR(100),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP
);


-- TABLA UNIDADES CLÍNICAS

CREATE TABLE unidades_clinicas (
    id_unidad SERIAL PRIMARY KEY,
    nombre_unidad VARCHAR(100) NOT NULL,
    anexo VARCHAR(20),
    nombre_encargado VARCHAR(100)
);


-- TABLA PRENDAS (catálogo)

CREATE TABLE prendas (
    id_prenda SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    detalle TEXT,
    peso FLOAT,
    tipo VARCHAR(20) NOT NULL
);

-- Índice para búsqueda rápida de prendas
CREATE INDEX idx_prendas_nombre ON prendas(nombre);


-- TABLA ROPERÍAS

CREATE TABLE roperias (
    id_roperia SERIAL PRIMARY KEY,
    nombre_encargado VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    lugar VARCHAR(30) NOT NULL
);


-- TABLA REPARACIONES

CREATE TABLE reparaciones (
    id_reparacion SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP
);


-- TABLA BAJAS

CREATE TABLE bajas (
    id_baja SERIAL PRIMARY KEY,
    motivo TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLA MOVIMIENTOS

CREATE TABLE movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (
        tipo_movimiento IN ('roperia','lavanderia','reproceso','unidad_clinica','reparacion','baja')
    ),
    operacion VARCHAR(10) NOT NULL CHECK (operacion IN ('entrada','salida')), -- NUEVO
    id_lavanderia INT REFERENCES lavanderias(id_lavanderia),
    id_reproceso INT REFERENCES reprocesos(id_reproceso),
    id_unidad INT REFERENCES unidades_clinicas(id_unidad),
    id_reparacion INT REFERENCES reparaciones(id_reparacion),
    id_baja INT REFERENCES bajas(id_baja),
    id_prenda INT REFERENCES prendas(id_prenda),
    id_roperia INT REFERENCES roperias(id_roperia),
    observacion TEXT,
    cantidad INT DEFAULT 1,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validación: asegura que solo un id_* se use según tipo_movimiento
    CONSTRAINT chk_movimientos_tipo_id CHECK (
           (tipo_movimiento = 'roperia' AND id_roperia IS NOT NULL AND id_lavanderia IS NULL AND id_reproceso IS NULL AND id_unidad IS NULL AND id_reparacion IS NULL AND id_baja IS NULL)
        OR (tipo_movimiento = 'lavanderia' AND id_lavanderia IS NOT NULL AND id_roperia IS NULL AND id_reproceso IS NULL AND id_unidad IS NULL AND id_reparacion IS NULL AND id_baja IS NULL)
        OR (tipo_movimiento = 'reproceso' AND id_reproceso IS NOT NULL AND id_roperia IS NULL AND id_lavanderia IS NULL AND id_unidad IS NULL AND id_reparacion IS NULL AND id_baja IS NULL)
        OR (tipo_movimiento = 'unidad_clinica' AND id_unidad IS NOT NULL AND id_roperia IS NULL AND id_lavanderia IS NULL AND id_reproceso IS NULL AND id_reparacion IS NULL AND id_baja IS NULL)
        OR (tipo_movimiento = 'reparacion' AND id_reparacion IS NOT NULL AND id_roperia IS NULL AND id_lavanderia IS NULL AND id_reproceso IS NULL AND id_unidad IS NULL AND id_baja IS NULL)
        OR (tipo_movimiento = 'baja' AND id_baja IS NOT NULL AND id_roperia IS NULL AND id_lavanderia IS NULL AND id_reproceso IS NULL AND id_unidad IS NULL AND id_reparacion IS NULL)
    )
);

-- Índices que pueden servir
CREATE INDEX idx_movimientos_fecha ON movimientos(fecha);
CREATE INDEX idx_movimientos_id_prenda ON movimientos(id_prenda);


-- TABLA INVENTARIO GENERAL 

CREATE TABLE inventario_general (
    id_inventario SERIAL PRIMARY KEY,
    id_prenda INT NOT NULL REFERENCES prendas(id_prenda),
    cantidad INT NOT NULL DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_prenda UNIQUE (id_prenda)
);


-- TRIGGER PARA INVENTARIO GENERAL

CREATE OR REPLACE FUNCTION actualizar_inventario_general()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.operacion = 'entrada' THEN
        INSERT INTO inventario_general (id_prenda, cantidad, ultima_actualizacion)
        VALUES (NEW.id_prenda, NEW.cantidad, CURRENT_TIMESTAMP)
        ON CONFLICT (id_prenda)
        DO UPDATE SET
            cantidad = inventario_general.cantidad + EXCLUDED.cantidad,
            ultima_actualizacion = CURRENT_TIMESTAMP;
    ELSE
        INSERT INTO inventario_general (id_prenda, cantidad, ultima_actualizacion)
        VALUES (NEW.id_prenda, -NEW.cantidad, CURRENT_TIMESTAMP)
        ON CONFLICT (id_prenda)
        DO UPDATE SET
            cantidad = inventario_general.cantidad - NEW.cantidad,
            ultima_actualizacion = CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_inventario_general
AFTER INSERT ON movimientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_general();

INSERT INTO usuarios (nombre_usuario, rut, email, password, rol)
VALUES
('Admin', '11111111-1', 'admin@correo.cl', '$2b$10$8Ah3UQnLQq3ZbEtGxwLkSuXCMzFiIKlYqvYp1h98jFYTHzFQO/hca', 'administrador'),
('Usuario', '22222222-2', 'usuario@correo.cl', '$2b$10$gDWNjN1TXqNMezqcwXNz0uCnmP9f6wX4x9o0F9FO1PTSyqfqbhwOa', 'usuario');

INSERT INTO roperias (nombre_encargado, email, lugar)
VALUES ('María Pérez', 'maria.perez@chillan.cl', 'Clinica Chillan');

INSERT INTO lavanderias (nombre, rut, telefono)
VALUES ('Lavandería Romero', '76543210-9', '+56 9 1234 5678');

INSERT INTO unidades_clinicas (nombre_unidad, anexo, nombre_encargado)
VALUES ('Urgencias', '3099', 'Dr. Juan Soto');


