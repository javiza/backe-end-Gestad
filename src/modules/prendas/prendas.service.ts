import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prenda } from './prendas.entity';
import { Repository } from 'typeorm';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly repo: Repository<Prenda>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const prenda = await this.repo.findOne({ where: { id } });
    if (!prenda) throw new NotFoundException('Prenda no encontrada');
    return prenda;
  }

  create(dto: CreatePrendaDto) {
    const prenda = this.repo.create(dto);
    return this.repo.save(prenda);
  }

  async update(id: string, dto: UpdatePrendaDto) {
    const prenda = await this.findOne(id);
    Object.assign(prenda, dto);
    return this.repo.save(prenda);
  }

  async remove(id: string) {
    const prenda = await this.findOne(id);
    await this.repo.remove(prenda);
  }
}