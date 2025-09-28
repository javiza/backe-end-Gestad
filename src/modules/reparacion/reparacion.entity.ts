import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity'; 
import { Prenda } from '../prendas/prendas.entity';

@Entity('reparaciones')
export class Reparacion {
  @PrimaryGeneratedColumn({ name: 'id_reparacion' })
  id: number;

  @ManyToOne(() => Prenda, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'timestamp', name: 'fecha_inicio', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', name: 'fecha_fin', nullable: true })
  fecha_fin?: Date;

  @OneToMany(() => Movimiento, movimiento => movimiento.reparacion)
  movimientos: Movimiento[];
}
