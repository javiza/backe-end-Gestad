import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Prenda, { onDelete: 'CASCADE' })
  @JoinColumn()
  prenda: Prenda;

  @Column({ type: 'int', default: 0 })
  cantidad_stock: number;  // stock actual disponible

  @Column({ type: 'int', default: 0 })
  cantidad_baja: number;   // acumulado de bajas
}