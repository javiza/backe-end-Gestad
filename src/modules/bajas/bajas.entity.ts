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

@Entity('bajas')
export class Baja {
  @PrimaryGeneratedColumn({ name: 'id_baja' })
  id: number;

  @ManyToOne(() => Prenda, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'text', nullable: false })
  motivo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  responsable?: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @OneToMany(() => Movimiento, movimiento => movimiento.baja)
  movimientos: Movimiento[];
}
