import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

export enum EstadoLavado {
  LAVADO = 'lavado',
  REPROCESO = 'reproceso',
  FINALIZADO = 'finalizado',
}

@Entity('lavanderia')
export class Lavanderia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prenda, prenda => prenda.lavanderia)
  prenda: Prenda;

  @CreateDateColumn()
  fecha_ingreso: Date;

  @Column({ type: 'enum', enum: EstadoLavado, default: EstadoLavado.LAVADO })
  estado: EstadoLavado;

  @Column({ nullable: true })
  observacion?: string;

  @OneToMany(() => Movimiento, mov => mov.lavanderia)
  movimientos: Movimiento[];
}