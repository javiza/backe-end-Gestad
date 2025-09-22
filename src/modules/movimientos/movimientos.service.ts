import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';
import { Roperia } from '../roperias/roperia.entity';

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
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia', 'roperia'],
    });
  }

  async findOne(id: number) {
    const movimiento = await this.repo.findOne({
      where: { id },
      relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia', 'roperia'],
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  async create(dto: CreateMovimientoDto) {
    // validar prenda
    const prenda = await this.prendasRepo.findOne({
      where: { id_prenda: dto.id_prenda },
    });
    if (!prenda) {
      throw new BadRequestException('Prenda no encontrada');
    }

    // Referencia a unidad clínica
    let unidad: UnidadClinica | null = null;
    if (dto.unidadId) {
      unidad = await this.unidadesRepo.findOne({ where: { id_unidad: dto.unidadId } });
      if (!unidad) throw new BadRequestException('Unidad clínica no encontrada');
    }

    // Referencia a usuario
    let usuario: Usuario | null = null;
    if (dto.id_usuario) {
      usuario = await this.usuariosRepo.findOne({ where: { id: dto.id_usuario } });
      if (!usuario) throw new BadRequestException('Usuario no encontrado');
    }

    // Referencia a baja
    let baja: Baja | null = null;
    if (dto.bajaId) {
      baja = await this.bajasRepo.findOne({ where: { id: dto.bajaId } });
      if (!baja) throw new BadRequestException('Baja no encontrada');
    }

    // Referencia a lavandería
    let lavanderia: Lavanderia | null = null;
    if (dto.lavanderiaId) {
      lavanderia = await this.lavanderiasRepo.findOne({ where: { id: dto.lavanderiaId } });
      if (!lavanderia) throw new BadRequestException('Lavandería no encontrada');
    }

    // Referencia a ropería (nuevo)
    let roperia: Roperia | null = null;
    if (dto.id_roperia) {
      roperia = await this.roperiasRepo.findOne({ where: { id: dto.id_roperia } });
      if (!roperia) throw new BadRequestException('Ropería no encontrada');
    }

    // Crear movimiento
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
    } as DeepPartial<Movimiento>);

    return this.repo.save(movimiento);
  }

  async remove(id: number) {
    const movimiento = await this.findOne(id);
    await this.repo.remove(movimiento);
  }
}
