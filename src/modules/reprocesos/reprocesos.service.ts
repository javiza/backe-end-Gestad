import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reproceso } from './reproceso.entity';
import { CreateReprocesoDto } from './dto/create-reproceso.dto';

@Injectable()
export class ReprocesosService {
  constructor(
    @InjectRepository(Reproceso)
    private readonly repo: Repository<Reproceso>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['movimientos'] });
  }

  async findOne(id: number) {
    const reproceso = await this.repo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!reproceso) {
      throw new NotFoundException('Reproceso no encontrado');
    }
    return reproceso;
  }

  create(dto: CreateReprocesoDto) {
    const reproceso = this.repo.create(dto);
    return this.repo.save(reproceso);
  }

  async remove(id: number) {
    const reproceso = await this.findOne(id);
    await this.repo.remove(reproceso);
  }

  // buscar movimiento por id
async findWithMovimientos(id: number, desde?: string, hasta?: string) {
  const query = this.repo.createQueryBuilder('reproceso')
    .leftJoinAndSelect('reproceso.movimientos', 'movimientos')
    .leftJoinAndSelect('movimientos.prenda', 'prenda')
    .leftJoinAndSelect('movimientos.usuario', 'usuario')
    .where('reproceso.id = :id', { id });

  if (desde && hasta) {
    query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
  }

  const reproceso = await query.getOne();

  if (!reproceso) {
    throw new NotFoundException('Reproceso no encontrado');
  }

  return reproceso;
}

}
