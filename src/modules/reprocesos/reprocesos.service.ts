import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reproceso } from './reproceso.entity';
import { CreateReprocesoDto } from './dto/create-reproceso.dto';
import { UpdateReprocesoDto } from './dto/update-reproceso.dto';

@Injectable()
export class ReprocesosService {
  constructor(
    @InjectRepository(Reproceso)
    private readonly repo: Repository<Reproceso>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ['prenda'], 
      order: { id_reproceso: 'DESC' },
    });
  }

  async findOne(id: number) {
    const reproceso = await this.repo.findOne({
      where: { id_reproceso: id },
      relations: ['prenda'],
    });
    if (!reproceso) {
      throw new NotFoundException(`Reproceso con ID ${id} no encontrado`);
    }
    return reproceso;
  }

  create(dto: CreateReprocesoDto) {
    const reproceso = this.repo.create(dto);
    return this.repo.save(reproceso);
  }

  async update(id: number, dto: UpdateReprocesoDto) {
    const reproceso = await this.repo.preload({
      id_reproceso: id,
      ...dto,
    });
    if (!reproceso) {
      throw new NotFoundException(`Reproceso con ID ${id} no encontrado`);
    }
    return this.repo.save(reproceso);
  }

  async remove(id: number) {
    const reproceso = await this.findOne(id);
    await this.repo.remove(reproceso);
  }
}
