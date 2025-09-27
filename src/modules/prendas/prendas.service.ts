import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Prenda } from './prendas.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import { Inventario } from '../inventario/inventario.entity';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly repo: Repository<Prenda>,
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>, // agregado
  ) {}

  async create(dto: CreatePrendaDto): Promise<Prenda> {
  // 1. Crear y guardar la prenda
  const prenda = this.repo.create(dto);
  const saved = await this.repo.save(prenda);

  // 2. Crear inventario inicial en ropería
  const inventario = this.inventarioRepo.create({
    prenda: saved as Prenda,  // se asegura que no es null
    tipo_entidad: 'roperia',
    cantidad: dto.cantidad ?? 0,
  });

  await this.inventarioRepo.save(inventario);

  // 3. Devolver la prenda con inventario incluido
  return this.repo.findOne({
    where: { id_prenda: saved.id_prenda },
    relations: ['inventarios'],
  }) as Promise<Prenda>;
}


async findAll(nombre?: string): Promise<Prenda[]> {
  if (nombre) {
    return this.repo.find({
      where: { nombre: ILike(`%${nombre}%`) },
      order: { id_prenda: 'ASC' },
      relations: ['inventarios', 'inventarios.unidad'], //trae nombre de unidad
    });
  }
  return this.repo.find({
    order: { id_prenda: 'ASC' },
    relations: ['inventarios', 'inventarios.unidad'], 
  });
}

async findOne(id: number): Promise<Prenda> {
  const prenda = await this.repo.findOne({
    where: { id_prenda: id },
    relations: ['inventarios', 'inventarios.unidad'], 
  });

  if (!prenda) {
    throw new NotFoundException('Prenda no encontrada');
  }
  return prenda;
}


  async update(id: number, dto: UpdatePrendaDto): Promise<Prenda> {
  // Solo tomar campos que existen en Prenda
  const prenda = await this.repo.preload({
    id_prenda: id,
    nombre: dto.nombre,
    detalle: dto.detalle,
    peso: dto.peso,
  });

  if (!prenda) {
    throw new NotFoundException('Prenda no encontrada');
  }

  const saved = await this.repo.save(prenda);

  // Manejo de cantidad → Inventario
  if (dto.cantidad !== undefined) {
    let inventario = await this.inventarioRepo.findOne({
      where: { prenda: { id_prenda: id }, tipo_entidad: 'roperia' },
    });

    if (!inventario) {
      inventario = this.inventarioRepo.create({
        prenda: saved,
        tipo_entidad: 'roperia',
        cantidad: dto.cantidad,
      });
    } else {
      inventario.cantidad = dto.cantidad;
    }

    await this.inventarioRepo.save(inventario);
  }

  return this.repo.findOne({
    where: { id_prenda: saved.id_prenda },
    relations: ['inventarios', 'inventarios.unidad'],
  }) as Promise<Prenda>;
}


  async remove(id: number): Promise<void> {
    const prenda = await this.findOne(id);
    await this.repo.remove(prenda);
  }

  //eliminar por fecha y nombre
 async removeByNombreYFecha(nombre: string, fecha: string): Promise<void> {
  const prenda = await this.repo.findOne({
    where: { nombre: ILike(nombre) },
    relations: ['inventarios'],
  });

  if (!prenda) {
    throw new NotFoundException(`No se encontró prenda con nombre: ${nombre}`);
  }

  // Validar inventarios antes de eliminar
  const inventario = prenda.inventarios.find(
    (inv) =>
      inv.ultima_actualizacion &&
      inv.ultima_actualizacion.toISOString().split('T')[0] === fecha,
  );

  if (!inventario) {
    throw new NotFoundException(
      `No se encontró inventario con fecha ${fecha} para la prenda ${nombre}`,
    );
  }

  // primero eliminar inventarios asociados
  if (prenda.inventarios.length > 0) {
    await this.inventarioRepo.remove(prenda.inventarios);
  }

  // después eliminar la prenda
  await this.repo.remove(prenda);
}


}
