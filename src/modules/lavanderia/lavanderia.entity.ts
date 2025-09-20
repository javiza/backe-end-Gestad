// lavanderia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('lavanderias')
export class Lavanderia {
  @PrimaryGeneratedColumn({ name: 'id_lavanderia' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  rut: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @OneToMany(() => Movimiento, mov => mov.lavanderia)
  movimientos: Movimiento[];
}
