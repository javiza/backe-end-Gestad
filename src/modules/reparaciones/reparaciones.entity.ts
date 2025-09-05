import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('reparaciones')
export class Reparacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prenda, prenda => prenda.reparaciones)
  prenda: Prenda;

  @CreateDateColumn()
  fecha_reparacion: Date;

  @Column({ nullable: true })
  observacion: string;

  @Column({ default: 1 })
  veces_reparada: number;

  @OneToMany(() => Movimiento, mov => mov.prenda)
  movimientos: Movimiento[];
}