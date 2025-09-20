import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roperia } from './roperia.entity';
import { CreateRoperiaDto } from './dto/create-roperia.dto';

@Injectable()
export class RoperiasService {
  constructor(
    @InjectRepository(Roperia)
    private readonly repo: Repository<Roperia>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['movimientos'] });
  }

  async findOne(id: number) {
    const roperia = await this.repo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!roperia) {
      throw new NotFoundException('Ropería no encontrada');
    }
    return roperia;
  }

  create(dto: CreateRoperiaDto) {
    const roperia = this.repo.create(dto);
    return this.repo.save(roperia);
  }

  async remove(id: number) {
    const roperia = await this.findOne(id);
    await this.repo.remove(roperia);
  }
  // roperia.service.ts
async findWithMovimientos(id: number, desde?: string, hasta?: string) {
  const query = this.repo.createQueryBuilder('roperia')
    .leftJoinAndSelect('roperia.movimientos', 'movimientos')
    .leftJoinAndSelect('movimientos.prenda', 'prenda')
    .leftJoinAndSelect('movimientos.usuario', 'usuario')
    .where('roperia.id = :id', { id });

  if (desde && hasta) {
    query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
  }

  const roperia = await query.getOne();

  if (!roperia) {
    throw new NotFoundException('Ropería no encontrada');
  }

  return roperia;
}

}
