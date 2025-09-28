import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, Like } from 'typeorm';
import { Reparacion } from './reparacion.entity';
import { CreateReparacionDto } from './dto/create-reparacion.dto';

interface ReparacionFilter {
  descripcion?: string;
  desde?: string;
  hasta?: string;
}

@Injectable()
export class ReparacionService {
  constructor(
    @InjectRepository(Reparacion)
    private readonly reparacionRepo: Repository<Reparacion>,
  ) {}

  async create(dto: CreateReparacionDto): Promise<Reparacion> {
    const reparacion = this.reparacionRepo.create({
      ...dto,
      prenda: { id_prenda: dto.id_prenda } as any, 
    });

    return this.reparacionRepo.save(reparacion);
  }

  async findAll(filter: ReparacionFilter = {}): Promise<Reparacion[]> {
    const where: FindOptionsWhere<Reparacion> = {};

    if (filter.descripcion) {
      where.descripcion = Like(`%${filter.descripcion}%`);
    }

    if (filter.desde && filter.hasta) {
      where.fecha_inicio = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha_inicio = Between(new Date(filter.desde), new Date());
    }

    return this.reparacionRepo.find({
      where,
      order: { fecha_inicio: 'DESC' },
      relations: ['movimientos'],
    });
  }

  async findOne(id: number): Promise<Reparacion> {
    const reparacion = await this.reparacionRepo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!reparacion) {
      throw new NotFoundException('Reparación no encontrada');
    }
    return reparacion;
  }

  async remove(id: number): Promise<void> {
    const reparacion = await this.findOne(id);

    // Valida que no tenga movimientos asociados antes de eliminar
    if (reparacion.movimientos && reparacion.movimientos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una reparación con movimientos asociados',
      );
    }

    await this.reparacionRepo.remove(reparacion);
  }

  async findWithMovimientos(id: number, desde?: string, hasta?: string) {
    const query = this.reparacionRepo.createQueryBuilder('reparacion')
      .leftJoinAndSelect('reparacion.movimientos', 'movimientos')
      .leftJoinAndSelect('movimientos.prenda', 'prenda')
      .leftJoinAndSelect('movimientos.usuario', 'usuario')
      .where('reparacion.id_reparacion = :id', { id });

    if (desde && hasta) {
      query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
    } else if (desde) {
      query.andWhere('movimientos.fecha >= :desde', { desde });
    } else if (hasta) {
      query.andWhere('movimientos.fecha <= :hasta', { hasta });
    }

    query.orderBy('movimientos.fecha', 'DESC');

    const reparacion = await query.getOne();

    if (!reparacion) {
      throw new NotFoundException('Reparación no encontrada');
    }

    return reparacion;
  }
}
