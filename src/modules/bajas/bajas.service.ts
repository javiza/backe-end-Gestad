import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, FindOptionsWhere, Like } from 'typeorm';
import { Baja } from './bajas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';
import { Inventario } from '../inventario/inventario.entity';
import { CreateBajaDto } from './dto/create-baja.dto';
import { TipoMovimiento } from '../movimientos/movimiento.entity';

interface BajaFilter {
  prendaId?: string;
  motivo?: string;
  desde?: string;
  hasta?: string;
}

@Injectable()
export class BajasService {
  constructor(
    @InjectRepository(Baja)
    private readonly bajasRepo: Repository<Baja>,

    @InjectRepository(Movimiento)
    private readonly movimientosRepo: Repository<Movimiento>,

    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,

    private readonly dataSource: DataSource, // ✅ para transacciones
  ) {}

  async create(createBajaDto: CreateBajaDto): Promise<Baja> {
    const { id_prenda, cantidad, motivo } = createBajaDto;

    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar inventario de la prenda
      const inventario = await queryRunner.manager.findOne(Inventario, {
        where: { prenda: { id: id_prenda } },
        relations: ['prenda'],
      });

      if (!inventario) {
        throw new NotFoundException('Inventario no encontrado para la prenda');
      }

      if (inventario.cantidad_stock < cantidad) {
        throw new BadRequestException('Stock insuficiente para dar de baja');
      }

      // Crear baja
      const baja = queryRunner.manager.create(Baja, {
        motivo,
        cantidad,
        prenda: { id: id_prenda } as any,
      });
      const savedBaja = await queryRunner.manager.save(baja);

      // Crear movimiento asociado
      const movimiento = queryRunner.manager.create(Movimiento, {
        tipo_movimiento: TipoMovimiento.BAJA,
        cantidad,
        prenda: { id: id_prenda } as any,
        observacion: motivo,
        baja: savedBaja,
      });
      await queryRunner.manager.save(movimiento);

      // Actualizar inventario
      inventario.cantidad_stock -= cantidad;
      inventario.cantidad_baja += cantidad;
      await queryRunner.manager.save(inventario);

      // Confirmar transacción
      await queryRunner.commitTransaction();

      return savedBaja;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

 async findAll(filter: BajaFilter = {}): Promise<Baja[]> {
    const where: FindOptionsWhere<Baja> = {};

    if (filter.prendaId) {
      where.prenda = { id: filter.prendaId } as any;
    }

    if (filter.motivo) {
      where.motivo = Like(`%${filter.motivo}%`);
    }

    if (filter.desde && filter.hasta) {
      where.fecha_baja = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha_baja = Between(new Date(filter.desde), new Date());
    }

    return this.bajasRepo.find({ where, relations: ['prenda', 'movimientos'], order: { fecha_baja: 'DESC' } });
  }

  async findOne(id: string): Promise<Baja> {
    const baja = await this.bajasRepo.findOne({
      where: { id },
      relations: ['prenda', 'movimientos'],
    });
    if (!baja) throw new NotFoundException('Baja no encontrada');
    return baja;
  }

  async remove(id: string): Promise<void> {
    const baja = await this.bajasRepo.findOne({ where: { id } });
    if (!baja) throw new NotFoundException('Baja no encontrada');
    await this.bajasRepo.remove(baja);
  }
}
