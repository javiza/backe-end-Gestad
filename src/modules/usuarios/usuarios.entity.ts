import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 100 })
  nombre_usuario: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 12,
    comment: 'RUT chileno con guion, ej: 12345678-9',
  })
  rut: string;

  @Column({ unique: true, type: 'varchar', length: 150 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  rol: 'administrador' | 'usuario';

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @OneToMany(() => Movimiento, (mov) => mov.usuario)
  movimientos: Movimiento[];
}
