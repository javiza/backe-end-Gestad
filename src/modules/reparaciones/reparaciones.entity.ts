import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from '../movimientos/movimiento.entity';
@Entity('reparaciones')
export class Reparacion {
  @PrimaryGeneratedColumn({ name: 'id_reparacion' })
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date | null;

  @OneToMany(() => Movimiento, mov => mov.reparacion)
    movimientos: Movimiento[];
}
