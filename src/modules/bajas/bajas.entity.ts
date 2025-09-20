import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity'; 

@Entity('bajas')
export class Baja {
  @PrimaryGeneratedColumn({ name: 'id_baja' })
  id: number;

  @Column({ type: 'text', nullable: false })
  motivo: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @OneToMany(() => Movimiento, movimiento => movimiento.baja)
  movimientos: Movimiento[];
}
