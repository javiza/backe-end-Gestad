import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Prenda } from './prendas.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import { MovimientosService } from '../movimientos/movimientos.service';
import { CreatePrendaConMovimientoDto } from './dto/create-prenda-con-movimiento.dto';
import { TipoMovimientoDB, Operacion } from '../movimientos/movimiento.entity';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly repo: Repository<Prenda>,
    private readonly movimientosService: MovimientosService,
  ) {}

  async findAll(nombre?: string) {
  const query = this.repo.createQueryBuilder('prenda')
    .leftJoinAndSelect('prenda.movimientos', 'movimiento')
    .orderBy('movimiento.fecha', 'DESC');

  if (nombre) {
    query.where('prenda.nombre ILIKE :nombre', { nombre: `%${nombre}%` });
  }

  const prendas = await query.getMany();

  // 🔧 devolvemos cada prenda con su último movimiento
  return prendas.map((p) => {
    const ultimoMovimiento = p.movimientos?.[0]; // el más reciente por el orderBy
    return {
      id_prenda: p.id_prenda,
      nombre: p.nombre,
      detalle: p.detalle,
      tipo: p.tipo,
      peso: p.peso,
      cantidad: ultimoMovimiento?.cantidad ?? 0,
      fechaIngreso: ultimoMovimiento?.fecha ?? null,
    };
  });
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

  async createWithMovimiento(dto: CreatePrendaConMovimientoDto, userId: number) {
  console.log('DTO recibido:', dto);

  // 1. Crear la prenda
  const prenda = this.repo.create({
    nombre: dto.nombre,
    detalle: dto.detalle,
    peso: dto.peso,
    tipo: dto.tipo,
  });
  await this.repo.save(prenda);

  // 2. Crear movimiento en ropería
  const movimiento = await this.movimientosService.create({
    id_prenda: prenda.id_prenda,
    cantidad: dto.cantidad,
    tipo_movimiento: TipoMovimientoDB.ROPERIA,
    operacion: Operacion.ENTRADA,
    observacion: 'Ingreso inicial en ropería',
    id_usuario: userId,
    id_roperia: dto.id_roperia ?? 1,
  });

  // 3. Devolver prenda + fecha del movimiento
  return {
    prenda,
    movimiento: {
      fecha: movimiento.fecha,
    },
  };
}

}
