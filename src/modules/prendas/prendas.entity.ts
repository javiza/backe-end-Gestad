
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';
import { InventarioGeneral } from '../inventario/inventario.entity';

@Entity('prendas')
export class Prenda {
  @PrimaryGeneratedColumn({ name: 'id_prenda' })
  id_prenda: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  detalle?: string;

  @Column({ type: 'float', nullable: true })
  peso?: number;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  // Relación 1 a N con movimientos
  @OneToMany(() => Movimiento, mov => mov.prenda)
  movimientos: Movimiento[];

  // Relación 1 a 1 con inventario
  @OneToOne(() => InventarioGeneral, inv => inv.prenda)
  inventario: InventarioGeneral;
}
