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
    return this.repo.find();
  }

  async findOne(id: string) {
    const unidad = await this.repo.findOne({ where: { id } });
    if (!unidad) throw new NotFoundException('Unidad clínica no encontrada');
    return unidad;
  }

  create(dto: CreateUnidadClinicaDto) {
    const unidad = this.repo.create(dto);
    return this.repo.save(unidad);
  }

  async update(id: string, dto: UpdateUnidadClinicaDto) {
    const unidad = await this.findOne(id);
    Object.assign(unidad, dto);
    return this.repo.save(unidad);
  }

  async remove(id: string) {
    const unidad = await this.findOne(id);
    await this.repo.remove(unidad);
  }
}