import { DataSource } from 'typeorm';
import { Usuario } from '../modules/usuarios/usuarios.entity';
import { Movimiento } from '../modules/movimientos/movimiento.entity'; // <-- Importa Movimiento
import { Prenda } from '../modules/prendas/prendas.entity';
import { Baja } from '../modules/bajas/bajas.entity';
import { Lavanderia } from '../modules/lavanderia/lavanderia.entity';
import { Reparacion } from '../modules/reparaciones/reparaciones.entity';
import { UnidadClinica } from '../modules/unidades_clinicas/unidades_clinicas.entity';
import { Inventario } from '../modules/inventario/inventario.entity';

import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jona',
  password: '1234',
  database: 'gestadroperia',
  entities: [Usuario, Movimiento, Prenda, Baja, Lavanderia, Reparacion, UnidadClinica, Inventario], // <-- Agrégala aquí
  synchronize: false, // aca true solo para desarrollo en caso de que cree tablas automáticamente
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Usuario);

  const adminExists = await repo.findOne({ where: { email: 'admin@correo.cl' } });
  const userExists = await repo.findOne({ where: { email: 'usuario@correo.cl' } });

  if (!adminExists) {
    const admin = repo.create({
      nombre_usuario: 'Admin',
      rut: '11111111-1',
      email: 'admin@correo.cl',
      password: await bcrypt.hash('Admin123!', 10),
      rol: 'administrador',
    });
    await repo.save(admin);
    console.log('Usuario administrador creado');
  }
  if (!userExists) {
    const usuario = repo.create({
      nombre_usuario: 'Usuario',
      rut: '22222222-2',
      email: 'usuario@correo.cl',
      password: await bcrypt.hash('Usuario123!', 10),
      rol: 'usuario',
    });
    await repo.save(usuario);
    console.log('Usuario normal creado');
  }
  await AppDataSource.destroy();
}

seed();
