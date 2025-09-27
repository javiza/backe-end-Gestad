import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn({ name: 'id_inventario' })
  id: number;

  @ManyToOne(() => Prenda, (prenda) => prenda.inventarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;

  @Column({
    name: 'tipo_entidad',
    type: 'enum',
    enum: ['roperia', 'lavanderia', 'unidad', 'reproceso', 'baja'],
  })
  tipo_entidad: 'roperia' | 'lavanderia' | 'unidad' | 'reproceso' | 'baja';

  @ManyToOne(() => UnidadClinica, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_unidad' })
  unidad?: UnidadClinica;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @UpdateDateColumn({
    name: 'ultima_actualizacion',
    type: 'timestamp',
  })
  ultima_actualizacion: Date;
}
