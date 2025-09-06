import { Controller, Get, Post, Delete, Param, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ReparacionesService } from './reparaciones.service';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reparaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReparacionesController {
  constructor(private readonly reparacionesService: ReparacionesService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateReparacionDto) {
    return this.reparacionesService.create(dto);
  }

  @Get()
  findAll(
    @Query('prendaId') prendaId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('export') exportFormat?: string, // ojo aca  alo mejor debo retirar "excel" | "pdf"
  ) {
    return this.reparacionesService.findAll({
      prendaId,
      desde,
      hasta,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      exportFormat,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reparacionesService.findOne(id);
  }

  @Roles('administrador')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reparacionesService.remove(id);
  }
}