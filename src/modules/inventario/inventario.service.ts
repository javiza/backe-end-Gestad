import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario-dto';

@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  async create(dto: CreateInventarioDto): Promise<Inventario> {
    if (dto.tipo_entidad === 'unidad' && !dto.id_unidad) {
      throw new BadRequestException('Debe especificar id_unidad cuando tipo_entidad = unidad');
    }

    const inventario = this.inventarioRepo.create({
      ...dto,
      unidad: dto.id_unidad ? ({ id_unidad: dto.id_unidad } as any) : null,
      prenda: { id_prenda: dto.id_prenda } as any,
    });

    return this.inventarioRepo.save(inventario);
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.inventarioRepo.findAndCount({
      relations: ['prenda', 'unidad'],
      skip,
      take: limit,
      order: { ultima_actualizacion: 'DESC' },
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOne({
      where: { id },
      relations: ['prenda', 'unidad'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
    return inventario;
  }

  async update(id: number, dto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.inventarioRepo.preload({
      id,
      ...dto,
      unidad: dto.id_unidad ? ({ id_unidad: dto.id_unidad } as any) : null,
      prenda: dto.id_prenda ? ({ id_prenda: dto.id_prenda } as any) : undefined,
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return this.inventarioRepo.save(inventario);
  }

  async remove(id: number): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepo.remove(inventario); // borrado físico
  }

  async getStock(id_prenda: number, tipo_entidad: string, id_unidad?: number): Promise<number> {
    const where: any = { prenda: { id_prenda }, tipo_entidad };
    if (tipo_entidad === 'unidad' && id_unidad) {
      where.unidad = { id_unidad };
    }

    const inventario = await this.inventarioRepo.findOne({
      where,
      relations: ['prenda', 'unidad'],
    });

    //Devuelve 0 en lugar de lanzar error si no hay inventario
    if (!inventario) {
      return 0;
    }

    return inventario.cantidad;
  }
  async buscarPorNombre(nombre: string) {
  const inventarios = await this.inventarioRepo.find({
    where: {
      prenda: { nombre },
    },
    relations: ['prenda', 'unidad'],
  });

  if (!inventarios.length) {
    throw new NotFoundException(`No se encontró inventario para la prenda: ${nombre}`);
  }

  // Transformar para devolver solo lo necesario
  return inventarios.map(inv => ({
    nombre: inv.prenda.nombre,
    tipo_entidad: inv.tipo_entidad,
    unidad: inv.unidad ? inv.unidad.nombre_unidad : null,
    cantidad: inv.cantidad,
  }));
}

}
