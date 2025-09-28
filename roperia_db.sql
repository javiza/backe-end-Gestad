CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]{1}$'),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hash bcrypt
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'usuario')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prendas (
    id_prenda SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    detalle TEXT,
    peso FLOAT
);
CREATE TABLE unidades_clinicas (
    id_unidad SERIAL PRIMARY KEY,
    nombre_unidad VARCHAR(100) NOT NULL,
    anexo VARCHAR(20),
    nombre_encargado VARCHAR(100)
);

CREATE TABLE inventarios (
    id_inventario SERIAL PRIMARY KEY,
    id_prenda INT NOT NULL REFERENCES prendas(id_prenda) ON DELETE CASCADE,
    tipo_entidad VARCHAR(20) NOT NULL CHECK (tipo_entidad IN ('roperia','lavanderia','unidad','reproceso','baja')),
    id_unidad INT REFERENCES unidades_clinicas(id_unidad), -- solo si tipo_entidad = 'unidad'
    cantidad INT NOT NULL DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_inventario UNIQUE (id_prenda, tipo_entidad, id_unidad)
);
CREATE TABLE reprocesos (
    id_reproceso SERIAL PRIMARY KEY,
    id_prenda INT NOT NULL REFERENCES prendas(id_prenda) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    descripcion TEXT,
    responsable VARCHAR(100),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE bajas (
    id_baja SERIAL PRIMARY KEY,
    id_prenda INT NOT NULL REFERENCES prendas(id_prenda) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    motivo TEXT NOT NULL,
    responsable VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id),
    id_prenda INT NOT NULL REFERENCES prendas(id_prenda) ON DELETE CASCADE,
    id_reproceso INT REFERENCES reprocesos(id_reproceso),
    id_baja INT REFERENCES bajas(id_baja),
    cantidad INT NOT NULL,
    desde_tipo VARCHAR(20) CHECK (desde_tipo IN ('roperia','lavanderia','unidad','reproceso','baja')),
    desde_id_unidad INT REFERENCES unidades_clinicas(id_unidad) ON DELETE CASCADE,
    hacia_tipo VARCHAR(20) CHECK (hacia_tipo IN ('roperia','lavanderia','unidad','reproceso','baja')),
    hacia_id_unidad INT REFERENCES unidades_clinicas(id_unidad) ON DELETE CASCADE,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION actualizar_inventario_al_eliminar()
RETURNS TRIGGER AS $$
BEGIN
  -- Si había un destino, restamos stock
  IF OLD.hacia_tipo IS NOT NULL THEN
    UPDATE inventarios
    SET cantidad = cantidad - OLD.cantidad,
        ultima_actualizacion = CURRENT_TIMESTAMP
    WHERE id_prenda = OLD.id_prenda
      AND tipo_entidad = OLD.hacia_tipo
      AND (id_unidad IS NOT DISTINCT FROM OLD.hacia_id_unidad);

    -- Evitar stock negativo
    IF EXISTS (
      SELECT 1 FROM inventarios
      WHERE id_prenda = OLD.id_prenda
        AND tipo_entidad = OLD.hacia_tipo
        AND (id_unidad IS NOT DISTINCT FROM OLD.hacia_id_unidad)
        AND cantidad < 0
    ) THEN
      RAISE EXCEPTION 'No se puede eliminar el movimiento: stock quedaría negativo en % para la prenda %',
        OLD.hacia_tipo, OLD.id_prenda;
    END IF;
  END IF;

  -- Si había un origen, devolvemos stock
  IF OLD.desde_tipo IS NOT NULL THEN
    INSERT INTO inventarios (id_prenda, tipo_entidad, id_unidad, cantidad, ultima_actualizacion)
    VALUES (OLD.id_prenda, OLD.desde_tipo, OLD.desde_id_unidad, OLD.cantidad, CURRENT_TIMESTAMP)
    ON CONFLICT (id_prenda, tipo_entidad, id_unidad)
    DO UPDATE SET
      cantidad = inventarios.cantidad + EXCLUDED.cantidad,
      ultima_actualizacion = CURRENT_TIMESTAMP;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_inventario_al_eliminar
AFTER DELETE ON movimientos
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_al_eliminar();







