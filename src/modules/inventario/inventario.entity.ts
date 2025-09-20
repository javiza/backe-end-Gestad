// inventario-general.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';

@Entity('inventario_general')
export class InventarioGeneral {
  @PrimaryGeneratedColumn({ name: 'id_inventario' })
  id: number;

  @OneToOne(() => Prenda, prenda => prenda.inventario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' }) // clave foránea real
  prenda: Prenda;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @CreateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;
}
