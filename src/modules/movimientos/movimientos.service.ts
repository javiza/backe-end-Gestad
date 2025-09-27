import {
  Injectable,
  NotFoundException,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Movimiento, TipoEntidad } from './movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Inventario } from '../inventario/inventario.entity';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento) private readonly repo: Repository<Movimiento>,
    @InjectRepository(Prenda) private readonly prendasRepo: Repository<Prenda>,
    @InjectRepository(UnidadClinica) private readonly unidadesRepo: Repository<UnidadClinica>,
    @InjectRepository(Usuario) private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Inventario) private readonly inventarioRepo: Repository<Inventario>, // 👈 agregado
  ) {}

  async findAllPaginated(page = 1, limit = 20) {
    const [data, total] = await this.repo.findAndCount({
      relations: ['prenda', 'usuario', 'desde_unidad', 'hacia_unidad'],
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const movimiento = await this.repo.findOne({
      where: { id_movimiento: id },
      relations: ['prenda', 'usuario', 'desde_unidad', 'hacia_unidad'],
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  async create(dto: CreateMovimientoDto, userId: number) {
  // 1. Validar prenda por nombre
  const prenda = await this.prendasRepo.findOne({ where: { nombre: dto.nombre_prenda } });
  if (!prenda) {
    throw new BadRequestException(`Prenda '${dto.nombre_prenda}' no encontrada`);
  }

  // 2. Validar usuario autenticado
  const usuario = await this.usuariosRepo.findOne({ where: { id: userId } });
  if (!usuario) {
    throw new BadRequestException('Usuario no encontrado');
  }

  // 3. Validar unidades
  let desde_unidad: UnidadClinica | null = null;
  if (dto.desde_tipo === TipoEntidad.UNIDAD) {
    if (!dto.desde_id_unidad) {
      throw new BadRequestException('Se requiere desde_id_unidad');
    }
    desde_unidad = await this.unidadesRepo.findOne({ where: { id_unidad: dto.desde_id_unidad } });
    if (!desde_unidad) {
      throw new BadRequestException('Unidad origen no encontrada');
    }
  }

  let hacia_unidad: UnidadClinica | null = null;
  if (dto.hacia_tipo === TipoEntidad.UNIDAD) {
    if (!dto.hacia_id_unidad) {
      throw new BadRequestException('Se requiere hacia_id_unidad');
    }
    hacia_unidad = await this.unidadesRepo.findOne({ where: { id_unidad: dto.hacia_id_unidad } });
    if (!hacia_unidad) {
      throw new BadRequestException('Unidad destino no encontrada');
    }
  }

  // 4. Crear movimiento
  const movimiento = this.repo.create({
    cantidad: dto.cantidad,
    desde_tipo: dto.desde_tipo,
    hacia_tipo: dto.hacia_tipo,
    descripcion: dto.descripcion,
    prenda,
    usuario,
    desde_unidad,
    hacia_unidad,
  } as DeepPartial<Movimiento>);

  const saved = await this.repo.save(movimiento);

  // 5. Actualizar inventarios usando prenda.id_prenda
  await this.ajustarStock(prenda.id_prenda, dto.desde_tipo, -dto.cantidad, dto.desde_id_unidad);
  await this.ajustarStock(prenda.id_prenda, dto.hacia_tipo, dto.cantidad, dto.hacia_id_unidad);

  // 6. Retornar movimiento completo
  return this.findOne(saved.id_movimiento);
}




  async remove(id: number) {
    const movimiento = await this.findOne(id);
    await this.repo.remove(movimiento);
  }

  async update(): Promise<never> {
    throw new MethodNotAllowedException('Actualizar movimientos está deshabilitado por consistencia de inventario');
  }

  // Ajuste de stock en inventarios
  private async ajustarStock(
  id_prenda: number,
  tipo: TipoEntidad,
  cantidad: number,
  id_unidad?: number,
) {
  const where: FindOptionsWhere<Inventario> = {
    prenda: { id_prenda } as any,
    tipo_entidad: tipo,
  };

  if (tipo === TipoEntidad.UNIDAD && id_unidad) {
    where.unidad = { id_unidad } as any;
  }

  let inventario = await this.inventarioRepo.findOne({
    where,
    relations: ['prenda', 'unidad'],
  });

  if (!inventario) {
    inventario = this.inventarioRepo.create({
      prenda: { id_prenda } as any,
      tipo_entidad: tipo,
      unidad: id_unidad ? ({ id_unidad } as any) : null,
      cantidad: 0,
    });
  }

  inventario.cantidad += cantidad;

  if (inventario.cantidad < 0) {
    throw new BadRequestException(
      `Stock insuficiente para la prenda ${id_prenda} en ${tipo}` +
        (id_unidad ? ` (unidad ${id_unidad})` : ''),
    );
  }

  await this.inventarioRepo.save(inventario);
}

}
