import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Movimiento, TipoMovimientoDB } from './movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';
import { Roperia } from '../roperias/roperia.entity';
import { Reproceso } from '../reprocesos/reproceso.entity';         
import { Reparacion } from '../reparaciones/reparaciones.entity';   

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly repo: Repository<Movimiento>,
    @InjectRepository(Prenda)
    private readonly prendasRepo: Repository<Prenda>,
    @InjectRepository(UnidadClinica)
    private readonly unidadesRepo: Repository<UnidadClinica>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Baja)
    private readonly bajasRepo: Repository<Baja>,
    @InjectRepository(Lavanderia)
    private readonly lavanderiasRepo: Repository<Lavanderia>,
    @InjectRepository(Roperia)
    private readonly roperiasRepo: Repository<Roperia>,
    @InjectRepository(Reproceso)                             
    private readonly reprocesosRepo: Repository<Reproceso>,
    @InjectRepository(Reparacion)                              
    private readonly reparacionesRepo: Repository<Reparacion>,
  ) {}

  // incluir reproceso y reparacion en las relaciones
  findAll() {
    return this.repo.find({
      relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia', 'roperia', 'reproceso', 'reparacion'],
      order: { fecha: 'DESC' }, // recomendable ordenar por fecha
    });
  }

  async findOne(id: number) {
    const movimiento = await this.repo.findOne({
      where: { id },
      relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia', 'roperia', 'reproceso', 'reparacion'],
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  // helper: validar que sólo se haya entregado el id relacional correspondiente al tipo
  private validarIdsPorTipo(dto: CreateMovimientoDto) {
    const map = {
      roperia: dto.id_roperia,
      lavanderia: dto.id_lavanderia,
      reproceso: dto.id_reproceso,
      unidad_clinica: dto.id_unidad,
      reparacion: dto.id_reparacion,
      baja: dto.id_baja,
    } as Record<string, any>;

    const provided = Object.entries(map).filter(([_, v]) => v !== undefined && v !== null);
    if (provided.length === 0) {
      throw new BadRequestException('Debe proveer el id correspondiente al tipo de movimiento');
    }
    if (provided.length > 1) {
      throw new BadRequestException('Solo se debe proporcionar un id relacional acorde al tipo de movimiento');
    }
    const [key] = provided[0];
    if (key !== dto.tipo_movimiento) {
      throw new BadRequestException(`El id proporcionado (${key}) no corresponde al tipo_movimiento '${dto.tipo_movimiento}'`);
    }
  }

  async create(dto: CreateMovimientoDto) {
    // validar prenda
    const prenda = await this.prendasRepo.findOne({ where: { id_prenda: dto.id_prenda } });
    if (!prenda) {
      throw new BadRequestException('Prenda no encontrada');
    }

    // validar exclusividad de ids relacionales según tipo_movimiento
    this.validarIdsPorTipo(dto);

    // Referencia a unidad clínica
    let unidad: UnidadClinica | null = null;
    if (dto.id_unidad) {
      unidad = await this.unidadesRepo.findOne({ where: { id_unidad: dto.id_unidad } });
      if (!unidad) {
        throw new BadRequestException('Unidad clínica no encontrada');
      }
    }

    // Referencia a usuario
    let usuario: Usuario | null = null;
    if (dto.id_usuario) {
      usuario = await this.usuariosRepo.findOne({ where: { id: dto.id_usuario } });
      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }
    }

    // Referencia a baja
    let baja: Baja | null = null;
    if (dto.id_baja) {
      baja = await this.bajasRepo.findOne({ where: { id: dto.id_baja } });
      if (!baja) {
        throw new BadRequestException('Baja no encontrada');
      }
    }

    // Referencia a lavandería
    let lavanderia: Lavanderia | null = null;
    if (dto.id_lavanderia) {
      lavanderia = await this.lavanderiasRepo.findOne({ where: { id: dto.id_lavanderia } });
      if (!lavanderia) {
        throw new BadRequestException('Lavandería no encontrada');
      }
    }

    // Referencia a ropería
    let roperia: Roperia | null = null;
    if (dto.id_roperia) {
      roperia = await this.roperiasRepo.findOne({ where: { id: dto.id_roperia } });
      if (!roperia) {
        throw new BadRequestException('Ropería no encontrada');
      }
    }

    // Referencia a reproceso 
    let reproceso: Reproceso | null = null;
    if (dto.id_reproceso) {
      reproceso = await this.reprocesosRepo.findOne({ where: { id: dto.id_reproceso } });
      if (!reproceso) {
        throw new BadRequestException('Reproceso no encontrado');
      }
    }

    // Referencia a reparación (nuevo)
    let reparacion: Reparacion | null = null;
    if (dto.id_reparacion) {
      reparacion = await this.reparacionesRepo.findOne({ where: { id: dto.id_reparacion } });
      if (!reparacion) {
        throw new BadRequestException('Reparación no encontrada');
      }
    }

    // Crear movimiento (asignando objetos de relación)
    const movimiento = this.repo.create({
      cantidad: dto.cantidad,
      tipo_movimiento: dto.tipo_movimiento,
      operacion: dto.operacion,
      observacion: dto.observacion,
      prenda,
      unidad,
      usuario,
      baja,
      lavanderia,
      roperia,
      reproceso,
      reparacion,
    } as DeepPartial<Movimiento>);

    const saved = await this.repo.save(movimiento);

    // retornar el movimiento con relaciones cargadas para el frontend
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const movimiento = await this.findOne(id);
    await this.repo.remove(movimiento);
  }
}
