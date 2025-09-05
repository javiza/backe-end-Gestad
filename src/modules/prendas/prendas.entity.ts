import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';
import { Reparacion } from '../reparaciones/reparaciones.entity';
import { Baja } from '../bajas/bajas.entity';

@Entity('prendas')
export class Prenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_prenda: string;

  @Column()
  cantidad: number;

  @Column({ nullable: true })
  detalle: string;

  @Column({ nullable: true })
  tipo: string;

  @CreateDateColumn()
  fecha_ingreso: Date;

  @OneToMany(() => Movimiento, mov => mov.prenda)
  movimientos: Movimiento[];

  @OneToMany(() => Lavanderia, lav => lav.prenda)
  lavanderia: Lavanderia[];

  @OneToMany(() => Reparacion, rep => rep.prenda)
  reparaciones: Reparacion[];

  @OneToMany(() => Baja, baja => baja.prenda)
  bajas: Baja[];
}
