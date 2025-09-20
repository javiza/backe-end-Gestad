import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('roperias')
export class Roperia {
  @PrimaryGeneratedColumn({ name: 'id_roperia' })
  id: number;

  @Column({ name: 'nombre_encargado', type: 'varchar', length: 100 })
  nombreEncargado: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  lugar: string;

  @OneToMany(() => Movimiento, mov => mov.roperia)
  movimientos: Movimiento[];
}
