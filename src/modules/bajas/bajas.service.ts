import { Injectable, NotFoundException } from '@nestjs/common';
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
      motivo: dto.motivo,
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

    return this.bajasRepo.find({ where, order: { fecha: 'DESC' } });
  }

  async findOne(id: number): Promise<Baja> {
    const baja = await this.bajasRepo.findOne({ where: { id } });
    if (!baja) {
      throw new NotFoundException('Baja no encontrada');
    }
    return baja;
  }

  async remove(id: number): Promise<void> {
    const baja = await this.bajasRepo.findOne({ where: { id } });
    if (!baja) {
      throw new NotFoundException('Baja no encontrada');
    }
    await this.bajasRepo.remove(baja);
  }
  // bajas.service.ts
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

  const baja = await query.getOne();

  if (!baja) {
    throw new NotFoundException('Baja no encontrada');
  }

  return baja;
}

}
