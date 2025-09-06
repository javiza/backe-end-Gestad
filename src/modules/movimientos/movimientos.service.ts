import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimiento } from './movimiento.entity';
import { Repository } from 'typeorm';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Lavanderia } from '../lavanderia/lavanderia.entity';
import { DeepPartial } from 'typeorm';// esto lo instale para que reconozca como objeto y no array
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
  ) {}

  findAll() {
    return this.repo.find({ relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia'] });
  }

  async findOne(id: string) {
    const movimiento = await this.repo.findOne({
      where: { id },
      relations: ['prenda', 'unidad', 'usuario', 'baja', 'lavanderia'],
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  async create(dto: CreateMovimientoDto) {
    const prenda = await this.prendasRepo.findOne({ where: { id: dto.prendaId } });
    if (!prenda) {
      throw new BadRequestException('Prenda no encontrada');
    }

    let unidad: UnidadClinica | null = null;
    if (dto.unidadId) {
      unidad = await this.unidadesRepo.findOne({ where: { id: dto.unidadId } });
      if (!unidad) {
        throw new BadRequestException('Unidad clínica no encontrada');
      }
    }

    let usuario: Usuario | null = null;
    if (dto.usuarioId) {
      usuario = await this.usuariosRepo.findOne({ where: { id: dto.usuarioId } });
      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }
    }

    let baja: Baja | null = null;
    if (dto.bajaId) {
      baja = await this.bajasRepo.findOne({ where: { id: dto.bajaId } });
      if (!baja) {
        throw new BadRequestException('Baja no encontrada');
      }
    }

    let lavanderia: Lavanderia | null = null;
    if (dto.lavanderiaId) {
      lavanderia = await this.lavanderiasRepo.findOne({ where: { id: dto.lavanderiaId } });
      if (!lavanderia) {
        throw new BadRequestException('Lavandería no encontrada');
      }
    }

  const movimiento = this.repo.create({
  cantidad: dto.cantidad,
  tipo_movimiento: dto.tipo_movimiento,
  observacion: dto.observacion,
  prenda,
  unidad,
  usuario,
  baja,
  lavanderia,
} as DeepPartial<Movimiento>);//tuve que forzar a que reconozca como objeto y no array
return this.repo.save(movimiento);
  }

  async remove(id: string) {
    const movimiento = await this.findOne(id);
    await this.repo.remove(movimiento);
  }
}