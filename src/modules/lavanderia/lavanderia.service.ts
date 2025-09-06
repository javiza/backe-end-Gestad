import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, FindOptionsWhere } from 'typeorm';
import { Lavanderia, EstadoLavado } from './lavanderia.entity';
import { Movimiento, TipoMovimiento } from '../movimientos/movimiento.entity';
import { Prenda } from '../prendas/prendas.entity';
import { IngresarLavadoDto, ActualizarEstadoDto } from './dto/lavanderia.dto';

interface LavanderiaFilter {
  estado?: string;
  prendaId?: string;
  desde?: string;
  hasta?: string;
}

@Injectable()
export class LavanderiaService {
  constructor(
    @InjectRepository(Lavanderia)
    private readonly lavanderiaRepo: Repository<Lavanderia>,

    @InjectRepository(Movimiento)
    private readonly movimientosRepo: Repository<Movimiento>,

    @InjectRepository(Prenda)
    private readonly prendasRepo: Repository<Prenda>,

    private readonly dataSource: DataSource,
  ) {}

  
   //Ingresar prenda a lavandería
   
  async ingresarPrenda(dto: IngresarLavadoDto): Promise<Lavanderia> {
    const prenda = await this.prendasRepo.findOne({ where: { id: dto.id_prenda } });
    if (!prenda) {
      throw new NotFoundException('Prenda no encontrada');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lavado = queryRunner.manager.create(Lavanderia, {
        prenda,
        estado: EstadoLavado.LAVADO,
        observacion: dto.observacion,
      });
      const savedLavado = await queryRunner.manager.save(lavado);

      // aqui va el movimiento envío a lavandería
      const movimiento = queryRunner.manager.create(Movimiento, {
        prenda,
        tipo_movimiento: TipoMovimiento.ENVIO_LAVANDERIA, // ✅ corregido
        observacion: dto.observacion,
        lavanderia: savedLavado,
      });
      await queryRunner.manager.save(movimiento);

      await queryRunner.commitTransaction();
      return savedLavado;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  
   // Actualizar estado del proceso de lavandería
   
  async actualizarEstado(id: string, dto: ActualizarEstadoDto): Promise<Lavanderia> {
    const lavado = await this.lavanderiaRepo.findOne({ where: { id }, relations: ['prenda'] });
    if (!lavado) {
      throw new NotFoundException('Lavandería no encontrada');
    }

    lavado.estado = dto.estado;
    if (dto.observacion) {
      lavado.observacion = dto.observacion;
    }
    const savedLavado = await this.lavanderiaRepo.save(lavado);

    // Movimiento según estado actualizado
    const movimiento = this.movimientosRepo.create({
      prenda: lavado.prenda,
      tipo_movimiento:
        dto.estado === EstadoLavado.FINALIZADO
        //opciones en caso que cualva a reproceso o se finaliza
          ? TipoMovimiento.LAVADO_FINALIZADO
          : TipoMovimiento.REPROCESO,        
      observacion: dto.observacion,
      lavanderia: savedLavado,
    });
    await this.movimientosRepo.save(movimiento);

    return savedLavado;
  }


   // Buscar registros de lavandería con filtros

  async findAll(filter: LavanderiaFilter = {}): Promise<Lavanderia[]> {
    const where: FindOptionsWhere<Lavanderia> = {};

    if (filter.estado && Object.values(EstadoLavado).includes(filter.estado as EstadoLavado)) {
      where.estado = filter.estado as EstadoLavado;
    }

    if (filter.prendaId) {
      where.prenda = { id: filter.prendaId } as any;
    }

    if (filter.desde && filter.hasta) {
      where.fecha_ingreso = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha_ingreso = Between(new Date(filter.desde), new Date());
    }

    return this.lavanderiaRepo.find({
      where,
      relations: ['prenda', 'movimientos'],
      order: { fecha_ingreso: 'DESC' },
    });
  }

  
  // Buscar un registro específico de lavandería
  async findOne(id: string): Promise<Lavanderia> {
    const lavado = await this.lavanderiaRepo.findOne({
      where: { id },
      relations: ['prenda', 'movimientos'],
    });
    if (!lavado) {
      throw new NotFoundException('Lavandería no encontrada');
    }
    return lavado;
  }
}
