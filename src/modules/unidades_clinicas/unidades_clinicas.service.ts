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

  async findAllPaginated(page = 1, limit = 20) {
    const [data, total] = await this.repo.findAndCount({
      relations: ['movimientosDesde', 'movimientosHacia'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id_unidad: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const unidad = await this.repo.findOne({
      where: { id_unidad: id },
      relations: ['movimientosDesde', 'movimientosHacia'],
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad clínica con ID ${id} no encontrada`);
    }

    return unidad;
  }

  create(dto: CreateUnidadClinicaDto) {
    const unidad = this.repo.create(dto);
    return this.repo.save(unidad);
  }

async update(id: number, dto: UpdateUnidadClinicaDto) {
  const unidad = await this.repo.preload({ id_unidad: id, ...dto });
  if (!unidad) {
    throw new NotFoundException(`Unidad clínica con ID ${id} no encontrada`);
  }
  return this.repo.save(unidad);
}

async remove(id: number) {
  const unidad = await this.findOne(id);
  await this.repo.remove(unidad); // delete físico
  // baja lógica si  columna `activo`
}


  async findWithMovimientos(id: number, desde?: string, hasta?: string) {
  const query = this.repo.createQueryBuilder('unidad')
    .leftJoinAndSelect('unidad.movimientosDesde', 'movimientosDesde')
    .leftJoinAndSelect('movimientosDesde.prenda', 'prendaDesde')
    .leftJoinAndSelect('movimientosDesde.usuario', 'usuarioDesde')
    .leftJoinAndSelect('unidad.movimientosHacia', 'movimientosHacia')
    .leftJoinAndSelect('movimientosHacia.prenda', 'prendaHacia')
    .leftJoinAndSelect('movimientosHacia.usuario', 'usuarioHacia')
    .where('unidad.id_unidad = :id', { id });

  if (desde && hasta) {
    query.andWhere(
      '(movimientosDesde.fecha BETWEEN :desde AND :hasta OR movimientosHacia.fecha BETWEEN :desde AND :hasta)',
      { desde, hasta },
    );
  } else if (desde) {
    query.andWhere(
      '(movimientosDesde.fecha >= :desde OR movimientosHacia.fecha >= :desde)',
      { desde },
    );
  } else if (hasta) {
    query.andWhere(
      '(movimientosDesde.fecha <= :hasta OR movimientosHacia.fecha <= :hasta)',
      { hasta },
    );
  }

  const unidad = await query.getOne();

  if (!unidad) {
    throw new NotFoundException(`Unidad clínica con ID ${id} no encontrada`);
  }

  // Respuesta estructurada
  return {
    id_unidad: unidad.id_unidad,
    nombre_unidad: unidad.nombre_unidad,
    anexo: unidad.anexo,
    nombre_encargado: unidad.nombre_encargado,
    movimientosDesde: unidad.movimientosDesde || [],
    movimientosHacia: unidad.movimientosHacia || [],
  };
}

}
