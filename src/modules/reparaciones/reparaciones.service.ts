import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reparacion } from './reparaciones.entity';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Prenda } from '../prendas/prendas.entity';
import { CreateReparacionDto } from './dto/create-reparacion.dto';

// Para exportar en Excel/PDF
import * as ExcelJS from 'exceljs';
// Para PDF podrías usar pdfkit, pero aquí solo muestro excel para ejemplo

interface ReparacionFilter {
  prendaId?: string;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
  exportFormat?: string;
}
@Injectable()
export class ReparacionesService {
  constructor(
    @InjectRepository(Reparacion)
    private readonly repo: Repository<Reparacion>,
    @InjectRepository(Prenda)
    private readonly prendasRepo: Repository<Prenda>,
  ) {}

  async create(dto: CreateReparacionDto): Promise<Reparacion> {
    const prenda = await this.prendasRepo.findOne({ where: { id: dto.prendaId } });
    if (!prenda) throw new NotFoundException('Prenda no encontrada');

    const reparacion = this.repo.create({
      prenda,
      observacion: dto.observacion,
      veces_reparada: dto.veces_reparada ?? 1,
    });

    return this.repo.save(reparacion);
  }

  async findAll(filter: ReparacionFilter = {}) {
    const where: FindOptionsWhere<Reparacion> = {};

    if (filter.prendaId) {
      where.prenda = { id: filter.prendaId } as any;
    }
    if (filter.desde && filter.hasta) {
      where.fecha_reparacion = Between(new Date(filter.desde), new Date(filter.hasta));
    } else if (filter.desde) {
      where.fecha_reparacion = Between(new Date(filter.desde), new Date());
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: ['prenda', 'movimientos'],
      order: { fecha_reparacion: 'DESC' },
      skip,
      take: limit,
    });

    // Exportar a Excel
    if (filter.exportFormat === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Reparaciones');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 36 },
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Prenda', key: 'prenda', width: 20 },
        { header: 'Observación', key: 'observacion', width: 30 },
        { header: 'Veces Reparada', key: 'veces_reparada', width: 10 },
      ];
      data.forEach(r => {
        sheet.addRow({
          id: r.id,
          fecha: r.fecha_reparacion,
          prenda: r.prenda?.nombre_prenda,
          observacion: r.observacion,
          veces_reparada: r.veces_reparada,
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      return { export: 'excel', buffer };
    }

    // Aquí podrías agregar lógica para PDF si quieres

    return {
      total,
      page,
      limit,
      data,
    };
  }
  async findOne(id: string): Promise<Reparacion> {
    const rep = await this.repo.findOne({ where: { id }, relations: ['prenda', 'movimientos'] });
    if (!rep) throw new NotFoundException('Reparación no encontrada');
    return rep;
  }

  async remove(id: string): Promise<void> {
    const rep = await this.repo.findOne({ where: { id } });
    if (!rep) throw new NotFoundException('Reparación no encontrada');
    await this.repo.remove(rep);
  }
}