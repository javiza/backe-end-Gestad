import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioGeneral } from './inventario.entity'; // ✅ usa el archivo correcto

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(InventarioGeneral)
    private readonly inventarioRepo: Repository<InventarioGeneral>,
  ) {}

  // ✅ obtiene el stock de una prenda
  async getStock(id_prenda: number): Promise<number> {
    const inventario = await this.inventarioRepo.findOne({
      where: { prenda: { id_prenda: id_prenda } },
      relations: ['prenda'],
    });

    if (!inventario) {
      throw new NotFoundException('Inventario no encontrado');
    }
    return inventario.cantidad;
  }

  // ✅ lista el inventario con paginación
  async getInventario(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.inventarioRepo.findAndCount({
      relations: ['prenda'],
      skip,
      take: limit,
      order: { cantidad: 'DESC' },
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
