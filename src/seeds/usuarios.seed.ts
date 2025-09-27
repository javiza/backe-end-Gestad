import { DataSource } from 'typeorm';
import { RolUsuario, Usuario } from '../modules/usuarios/usuarios.entity';
import { Movimiento } from '../modules/movimientos/movimiento.entity'; // <-- Importa Movimiento
import { Prenda } from '../modules/prendas/prendas.entity';
import { Baja } from '../modules/bajas/bajas.entity';
import { UnidadClinica } from '../modules/unidades_clinicas/unidades_clinicas.entity';
import { Inventario } from '../modules/inventario/inventario.entity';
import { Reproceso } from '../modules/reprocesos/reproceso.entity'

import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jona',
  password: '1234',
  database: 'roperia_db',
  entities: [Usuario, Movimiento, Prenda, Baja,  UnidadClinica, Inventario, Reproceso], // <-- Agrégala aquí
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
      rol: RolUsuario.ADMIN, 
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
      rol: RolUsuario.USUARIO,
    });
    await repo.save(usuario);
    console.log('Usuario normal creado');
  }
  await AppDataSource.destroy();
}

seed();
