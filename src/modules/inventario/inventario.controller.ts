import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // Consulta el stock de una prenda específica
  @Get(':id_prenda')
  getStock(@Param('id_prenda') id_prenda: string) {
    return this.inventarioService.getStock(id_prenda);
  }

  // Consulta todo el inventario con filtros y paginación
  @Get()
  getInventario(
    @Query('min') min?: string,
    @Query('max') max?: string,
    @Query('prendaId') prendaId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventarioService.getInventario({
      min: min ? parseInt(min) : undefined,
      max: max ? parseInt(max) : undefined,
      prendaId,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }
}