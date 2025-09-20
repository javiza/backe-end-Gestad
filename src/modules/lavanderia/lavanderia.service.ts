// lavanderia.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Lavanderia } from './lavanderia.entity';
import { CreateLavanderiaDto } from './dto/create-lavanderia.dto';
import { UpdateLavanderiaDto } from './dto/update-lavanderia.dto';

@Injectable()
export class LavanderiaService {
  constructor(
    @InjectRepository(Lavanderia)
    private readonly lavanderiaRepo: Repository<Lavanderia>,
  ) {}

  async create(dto: CreateLavanderiaDto): Promise<Lavanderia> {
    const lavanderia = this.lavanderiaRepo.create(dto);
    return this.lavanderiaRepo.save(lavanderia);
  }

  async findAll(nombre?: string): Promise<Lavanderia[]> {
    const where = nombre ? { nombre: Like(`%${nombre}%`) } : {};
    return this.lavanderiaRepo.find({ where });
  }

  async findOne(id: number): Promise<Lavanderia> {
    const lavanderia = await this.lavanderiaRepo.findOne({ where: { id } });
    if (!lavanderia) {
      throw new NotFoundException('Lavandería no encontrada');
    }
    return lavanderia;
  }

  async update(id: number, dto: UpdateLavanderiaDto): Promise<Lavanderia> {
    const lavanderia = await this.findOne(id);
    Object.assign(lavanderia, dto);
    return this.lavanderiaRepo.save(lavanderia);
  }

  async remove(id: number): Promise<void> {
    const lavanderia = await this.findOne(id);
    await this.lavanderiaRepo.remove(lavanderia);
  }
  async findWithMovimientos(id: number) {
  const lavanderia = await this.lavanderiaRepo.findOne({
    where: { id },
    relations: ['movimientos', 'movimientos.prenda', 'movimientos.usuario'],
  });

  if (!lavanderia) {
    throw new NotFoundException('Lavandería no encontrada');
  }

  return lavanderia;
}
}
