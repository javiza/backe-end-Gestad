
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Prenda } from './prendas.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly repo: Repository<Prenda>,
  ) {}

  findAll(nombre?: string) {
    const where = nombre ? { nombre: Like(`%${nombre}%`) } : {};
    return this.repo.find({ where });
  }

  async findOne(id: number) {
   const prenda = await this.repo.findOne({ where: { id_prenda: id } });
    if (!prenda) {
      throw new NotFoundException('Prenda no encontrada');
    }
    return prenda;
  }

  create(dto: CreatePrendaDto) {
    const prenda = this.repo.create(dto);
    return this.repo.save(prenda);
  }

  async update(id: number, dto: UpdatePrendaDto) {
    const prenda = await this.findOne(id);
    Object.assign(prenda, dto);
    return this.repo.save(prenda);
  }

  async remove(id: number) {
    const prenda = await this.findOne(id);
    await this.repo.remove(prenda);
  }
  async findWithMovimientos(id: number, desde?: string, hasta?: string) {
  const query = this.repo.createQueryBuilder('prenda')
    .leftJoinAndSelect('prenda.movimientos', 'movimientos')
    .leftJoinAndSelect('movimientos.unidad', 'unidad')
    .leftJoinAndSelect('movimientos.usuario', 'usuario')
    .leftJoinAndSelect('movimientos.lavanderia', 'lavanderia')
    .leftJoinAndSelect('movimientos.roperia', 'roperia')
    .leftJoinAndSelect('movimientos.reproceso', 'reproceso')
    .leftJoinAndSelect('movimientos.reparacion', 'reparacion')
    .where('prenda.id_prenda = :id', { id });

  if (desde && hasta) {
    query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
  } else if (desde) {
    query.andWhere('movimientos.fecha >= :desde', { desde });
  } else if (hasta) {
    query.andWhere('movimientos.fecha <= :hasta', { hasta });
  }

  const prenda = await query.getOne();

  if (!prenda) {
    throw new NotFoundException('Prenda no encontrada');
  }

  return prenda;
}

}
