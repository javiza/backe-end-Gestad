import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';

@Entity('reprocesos')
export class Reproceso {
  @PrimaryGeneratedColumn({ name: 'id_reproceso' })
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  responsable?: string;

  @CreateDateColumn({ name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fechaFin?: Date;

  @OneToMany(() => Movimiento, mov => mov.reproceso)
  movimientos: Movimiento[];
}
