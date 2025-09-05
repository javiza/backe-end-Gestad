import { Controller, Get, Query, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { LavanderiaService } from './lavanderia.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { IngresarLavadoDto, ActualizarEstadoDto } from './dto/lavanderia.dto';

@Controller('lavanderia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LavanderiaController {
  constructor(private readonly lavanderiaService: LavanderiaService) {}

  @Roles('administrador')
  @Post()
  ingresar(@Body() dto: IngresarLavadoDto) {
    return this.lavanderiaService.ingresarPrenda(dto);
  }

  @Roles('administrador')
  @Patch(':id')
  actualizarEstado(@Param('id') id: string, @Body() dto: ActualizarEstadoDto) {
    return this.lavanderiaService.actualizarEstado(id, dto);
  }

  @Get()
  findAll(
    @Query('estado') estado?: string,
    @Query('prendaId') prendaId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.lavanderiaService.findAll({ estado, prendaId, desde, hasta });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lavanderiaService.findOne(id);
  }
}