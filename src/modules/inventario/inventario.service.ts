import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { Inventario } from './inventario.entity';

interface InventarioFilter {
  min?: number;
  max?: number;
  prendaId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  // Lógica para actualizar inventario según movimientos
  async aplicarMovimiento(prendaId: string, tipo: string, cantidad: number) {
    let inventario = await this.inventarioRepo.findOne({ where: { prenda: { id: prendaId } }, relations: ['prenda'] });
    if (!inventario) {
      inventario = this.inventarioRepo.create({
        prenda: { id: prendaId } as any,
        cantidad_stock: 0,
        cantidad_baja: 0,
      });
    }

    switch (tipo) {
      case 'ingreso':
        inventario.cantidad_stock += cantidad;
        break;
      case 'baja':
        inventario.cantidad_stock -= cantidad;
        if (inventario.cantidad_stock < 0) inventario.cantidad_stock = 0;
        inventario.cantidad_baja += cantidad;
        break;
      case 'reparacion':
        // Puedes decidir si esto afecta stock o solo registra eventos
        break;
      case 'lavanderia':
        // Puedes decidir si esto afecta stock o solo registra eventos
        break;
      // otros tipos: agregar tu lógica
    }

    return this.inventarioRepo.save(inventario);
  }

  async getStock(id_prenda: string): Promise<number> {
    const inventario = await this.inventarioRepo.findOne({ where: { prenda: { id: id_prenda } } });
    if (!inventario) throw new NotFoundException('Inventario no encontrado');
    return inventario.cantidad_stock;
  }

  async getInventario(filter: InventarioFilter = {}) {
    const where: FindOptionsWhere<Inventario> = {};

    if (filter.min !== undefined) {
      where.cantidad_stock = MoreThanOrEqual(filter.min);
    }
    if (filter.max !== undefined) {
      where.cantidad_stock = Object.assign(where.cantidad_stock || {}, LessThanOrEqual(filter.max));
    }
    if (filter.prendaId) {
      where.prenda = { id: filter.prendaId } as any;
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.inventarioRepo.findAndCount({
      where,
      relations: ['prenda'],
      skip,
      take: limit,
      order: { cantidad_stock: 'DESC' },
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }
}