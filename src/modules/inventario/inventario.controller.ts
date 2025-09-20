import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get(':id_prenda')
  getStock(@Param('id_prenda', ParseIntPipe) id_prenda: number) {
    return this.inventarioService.getStock(id_prenda);
  }

  @Get()
  getInventario(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.inventarioService.getInventario(parseInt(page), parseInt(limit));
  }
}
