import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('unidades_clinicas')
export class UnidadClinica {
  @PrimaryGeneratedColumn({ name: 'id_unidad' })
  id_unidad: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_unidad: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  anexo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_encargado?: string;

  // Relación con movimientos que salen desde la unidad
  @OneToMany(() => Movimiento, (mov) => mov.desde_unidad)
  movimientosDesde: Movimiento[];

  // Relación con movimientos que llegan a la unidad
  @OneToMany(() => Movimiento, (mov) => mov.hacia_unidad)
  movimientosHacia: Movimiento[];
}
