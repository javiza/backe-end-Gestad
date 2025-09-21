import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Reparacion } from './reparaciones.entity';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import { UpdateReparacionDto } from './dto/update-reparacion.dto';
interface ReparacionFilter {
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ReparacionesService {
  constructor(
    @InjectRepository(Reparacion)
    private readonly repo: Repository<Reparacion>,
  ) {}

  //Crear una reparación 
  async create(dto: CreateReparacionDto): Promise<Reparacion> {
    const reparacion = this.repo.create({
      descripcion: dto.descripcion,
      fecha_fin: dto.fecha_fin ?? null,
    });
    return this.repo.save(reparacion);
  }

  //Listar reparaciones con filtros y paginación 
  async findAll(filter: ReparacionFilter = {}) {
    const where: FindOptionsWhere<Reparacion> = {};

    if (filter.desde && filter.hasta) {
      where.fecha_inicio = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha_inicio = Between(new Date(filter.desde), new Date());
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { fecha_inicio: 'DESC' },
      skip,
      take: limit,
    });

    return { total, page, limit, data };
  }

  //Buscar reparación por ID 
  async findOne(id: number): Promise<Reparacion> {
    const rep = await this.repo.findOne({ where: { id } });
    if (!rep) {
      throw new NotFoundException('Reparación no encontrada');
    }
    return rep;
  }

  // Actualizar reparación 
  async update(id: number, dto: UpdateReparacionDto): Promise<Reparacion> {
  const rep = await this.findOne(id);
  Object.assign(rep, dto);
  return this.repo.save(rep);
}

  // Eliminar reparación 
  async remove(id: number): Promise<void> {
    const rep = await this.findOne(id);
    await this.repo.remove(rep);
  }
  //buscar movimiento por id
  async findWithMovimientos(id: number, desde?: string, hasta?: string): Promise<Reparacion> {
  const query = this.repo.createQueryBuilder('reparacion')
    .leftJoinAndSelect('reparacion.movimientos', 'movimientos')
    .leftJoinAndSelect('movimientos.prenda', 'prenda')
    .leftJoinAndSelect('movimientos.usuario', 'usuario')
    .where('reparacion.id = :id', { id });

  if (desde && hasta) {
    query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
  } else if (desde) {
    query.andWhere('movimientos.fecha >= :desde', { desde });
  } else if (hasta) {
    query.andWhere('movimientos.fecha <= :hasta', { hasta });
  }

  const reparacion = await query.getOne();

  if (!reparacion) {
    throw new NotFoundException('Reparación no encontrada');
  }

  return reparacion;
}

}
