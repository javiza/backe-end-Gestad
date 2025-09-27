import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, Like } from 'typeorm';
import { Baja } from './bajas.entity';
import { CreateBajaDto } from './dto/create-baja.dto';

interface BajaFilter {
  motivo?: string;
  desde?: string;
  hasta?: string;
}

@Injectable()
export class BajasService {
  constructor(
    @InjectRepository(Baja)
    private readonly bajasRepo: Repository<Baja>,
  ) {}

  async create(dto: CreateBajaDto): Promise<Baja> {
    const baja = this.bajasRepo.create({
      ...dto,
      prenda: { id_prenda: dto.id_prenda } as any, 
    });

    return this.bajasRepo.save(baja);
  }

  async findAll(filter: BajaFilter = {}): Promise<Baja[]> {
    const where: FindOptionsWhere<Baja> = {};

    if (filter.motivo) {
      where.motivo = Like(`%${filter.motivo}%`);
    }

    if (filter.desde && filter.hasta) {
      where.fecha = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha = Between(new Date(filter.desde), new Date());
    }

    return this.bajasRepo.find({
      where,
      order: { fecha: 'DESC' },
      relations: ['movimientos'],
    });
  }

  async findOne(id: number): Promise<Baja> {
    const baja = await this.bajasRepo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!baja) {
      throw new NotFoundException('Baja no encontrada');
    }
    return baja;
  }

  async remove(id: number): Promise<void> {
    const baja = await this.findOne(id);

    // Valida que no tenga movimientos asociados antes de eliminar
    if (baja.movimientos && baja.movimientos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una baja con movimientos asociados',
      );
    }

    await this.bajasRepo.remove(baja);
  }

  async findWithMovimientos(id: number, desde?: string, hasta?: string) {
    const query = this.bajasRepo.createQueryBuilder('baja')
      .leftJoinAndSelect('baja.movimientos', 'movimientos')
      .leftJoinAndSelect('movimientos.prenda', 'prenda')
      .leftJoinAndSelect('movimientos.usuario', 'usuario')
      .where('baja.id_baja = :id', { id });

    if (desde && hasta) {
      query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
    } else if (desde) {
      query.andWhere('movimientos.fecha >= :desde', { desde });
    } else if (hasta) {
      query.andWhere('movimientos.fecha <= :hasta', { hasta });
    }

    query.orderBy('movimientos.fecha', 'DESC');

    const baja = await query.getOne();

    if (!baja) {
      throw new NotFoundException('Baja no encontrada');
    }

    return baja;
  }
}
