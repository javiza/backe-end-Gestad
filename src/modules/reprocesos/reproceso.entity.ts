import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('reprocesos')
export class Reproceso {
  @PrimaryGeneratedColumn({ name: 'id_reproceso' })
  id_reproceso: number;

  @ManyToOne(() => Prenda, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  responsable?: string;

  @CreateDateColumn({ name: 'fecha_inicio', type: 'timestamp' })
  fecha_inicio: Date;

 @OneToMany(() => Movimiento, (mov) => mov.reproceso)
movimientos: Movimiento[];
}
