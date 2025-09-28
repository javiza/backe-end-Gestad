import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Baja } from '../bajas/bajas.entity';
import { Reproceso } from '../reprocesos/reproceso.entity';
import { Reparacion } from '../reparacion/reparacion.entity';

export enum TipoEntidad {
  ROPERIA = 'roperia',
  LAVANDERIA = 'lavanderia',
  UNIDAD = 'unidad',
  REPROCESO = 'reproceso',
  BAJA = 'baja',
  REPARACION = 'reparacion',
}

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn({ name: 'id_movimiento' })
  id_movimiento: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'enum', enum: TipoEntidad, name: 'desde_tipo', nullable: true })
  desde_tipo?: TipoEntidad;

  @ManyToOne(() => UnidadClinica, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'desde_id_unidad' })
  desde_unidad?: UnidadClinica;

  @Column({ type: 'enum', enum: TipoEntidad, name: 'hacia_tipo', nullable: true })
  hacia_tipo?: TipoEntidad;

  @ManyToOne(() => UnidadClinica, { nullable: true, onDelete: 'CASCADE'  })
  @JoinColumn({ name: 'hacia_id_unidad' })
  hacia_unidad?: UnidadClinica;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.movimientos, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Prenda, (prenda) => prenda.movimientos, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;
  
  
  @ManyToOne(() => Baja, (baja) => baja.movimientos, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'id_baja' })
baja?: Baja;
  @ManyToOne(() => Reparacion, (reparacion) => reparacion.movimientos, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'id_reparacion' })
reparacion?: Reparacion;

@ManyToOne(() => Reproceso, (reproceso) => reproceso.movimientos, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'id_reproceso' })
reproceso?: Reproceso;

}
