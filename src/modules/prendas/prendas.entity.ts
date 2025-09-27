import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';
import { Inventario } from '../inventario/inventario.entity';

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

  @OneToMany(() => Movimiento, (mov: Movimiento) => mov.prenda, {
  cascade: ['remove'],  
})
movimientos: Movimiento[];

@OneToMany(() => Inventario, (inv: Inventario) => inv.prenda, {
  eager: true,
  cascade: ['remove'],   
})
inventarios: Inventario[];

}
