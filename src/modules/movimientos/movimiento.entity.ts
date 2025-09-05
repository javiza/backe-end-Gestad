import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';

export enum TipoMovimiento {
  INGRESO = 'ingreso',
  ASIGNACION_UNIDAD = 'asignacion_unidad',
  DEVOLUCION_SUCIA = 'devolucion_sucia',
  ENVIO_LAVANDERIA = 'envio_lavanderia',
  REPROCESO = 'reproceso',
  LAVADO_FINALIZADO = 'lavado_finalizado',
  REPARACION = 'reparacion',
  BAJA = 'baja',
}

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prenda, prenda => prenda.movimientos)
  prenda: Prenda;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ type: 'enum', enum: TipoMovimiento })
  tipo_movimiento: TipoMovimiento;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => UnidadClinica, unidad => unidad.movimientos, { nullable: true })
  unidad?: UnidadClinica;

  @ManyToOne(() => Usuario, usuario => usuario.movimientos, { nullable: true })
  usuario?: Usuario;

  @Column({ nullable: true })
  observacion?: string;

  @ManyToOne(() => Baja, baja => baja.movimientos, { nullable: true, onDelete: 'CASCADE' })
  baja?: Baja;

  @ManyToOne(() => Lavanderia, lavado => lavado.movimientos, { nullable: true })
  lavanderia?: Lavanderia;
}