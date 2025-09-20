import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadClinica } from './unidades_clinicas.entity';
import { Repository } from 'typeorm';
import { CreateUnidadClinicaDto } from './dto/create-unidad_clinica.dto';
import { UpdateUnidadClinicaDto } from './dto/update-unidad_clinica.dto';

@Injectable()
export class UnidadesClinicasService {
  constructor(
    @InjectRepository(UnidadClinica)
    private readonly repo: Repository<UnidadClinica>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['movimientos'] });

  }

  async findOne(id: number) {
  const unidad = await this.repo.findOne({
    where: { id_unidad: id }, 
    relations: ['movimientos'],
  });

  if (!unidad) {
    throw new NotFoundException('Unidad clínica no encontrada');
  }

  return unidad;
}


  create(dto: CreateUnidadClinicaDto) {
    const unidad = this.repo.create(dto);
    return this.repo.save(unidad);
  }

  async update(id: number, dto: UpdateUnidadClinicaDto) {
    const unidad = await this.findOne(id);
    Object.assign(unidad, dto);
    return this.repo.save(unidad);
  }

  async remove(id: number) {
    const unidad = await this.findOne(id);
    await this.repo.remove(unidad);
  }
  // unidades_clinicas.service.ts
async findWithMovimientos(id: number, desde?: string, hasta?: string) {
  const query = this.repo.createQueryBuilder('unidad')
    .leftJoinAndSelect('unidad.movimientos', 'movimientos')
    .leftJoinAndSelect('movimientos.prenda', 'prenda')
    .leftJoinAndSelect('movimientos.usuario', 'usuario')
    .where('unidad.id = :id', { id });

  if (desde && hasta) {
    query.andWhere('movimientos.fecha BETWEEN :desde AND :hasta', { desde, hasta });
  } else if (desde) {
    query.andWhere('movimientos.fecha >= :desde', { desde });
  } else if (hasta) {
    query.andWhere('movimientos.fecha <= :hasta', { hasta });
  }

  const unidad = await query.getOne();

  if (!unidad) {
    throw new NotFoundException('Unidad clínica no encontrada');
  }

  return unidad;
}

}