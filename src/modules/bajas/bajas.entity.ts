import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('bajas')
export class Baja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prenda, prenda => prenda.bajas, { onDelete: 'CASCADE' })
  prenda: Prenda;

  @CreateDateColumn()
  fecha_baja: Date;

  @Column({ nullable: true })
  motivo: string;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @OneToMany(() => Movimiento, mov => mov.baja)
  movimientos: Movimiento[];
}
