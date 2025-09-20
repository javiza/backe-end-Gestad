import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';
import { Reproceso } from '../reprocesos/reproceso.entity';
import { Reparacion } from '../reparaciones/reparaciones.entity';
import { Roperia } from '../roperias/roperia.entity';

export enum TipoMovimientoDB {
  ROPERIA = 'roperia',
  LAVANDERIA = 'lavanderia',
  REPROCESO = 'reproceso',
  UNIDAD_CLINICA = 'unidad_clinica',
  REPARACION = 'reparacion',
  BAJA = 'baja',
}

export enum Operacion {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
}

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn({ name: 'id_movimiento' })
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.movimientos, { nullable: false })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Prenda, prenda => prenda.movimientos, { nullable: false })
  @JoinColumn({ name: 'id_prenda' })
  prenda: Prenda;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

 @Column({ type: 'enum', enum: TipoMovimientoDB })
  tipo_movimiento: TipoMovimientoDB;

  @Column({ type: 'enum', enum: Operacion })
  operacion: Operacion;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;

  @ManyToOne(() => UnidadClinica, unidad => unidad.movimientos, { nullable: true })
  @JoinColumn({ name: 'id_unidad' })
  unidad?: UnidadClinica;

  @ManyToOne(() => Baja, baja => baja.movimientos, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_baja' })
  baja?: Baja;

  @ManyToOne(() => Lavanderia, lavado => lavado.movimientos, { nullable: true })
  @JoinColumn({ name: 'id_lavanderia' })
  lavanderia?: Lavanderia;

  @ManyToOne(() => Reproceso, repro => repro.movimientos, { nullable: true })
  @JoinColumn({ name: 'id_reproceso' })
  reproceso?: Reproceso;

  @ManyToOne(() => Reparacion, rep => rep.movimientos, { nullable: true })
  @JoinColumn({ name: 'id_reparacion' })
  reparacion?: Reparacion;

  @ManyToOne(() => Roperia, rop => rop.movimientos, { nullable: true })
  @JoinColumn({ name: 'id_roperia' })
  roperia?: Roperia;

  @Column({ nullable: true, type: 'text' })
  observacion?: string;
}
