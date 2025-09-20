import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BajasService } from './bajas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBajaDto } from './dto/create-baja.dto';

@Controller('bajas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BajasController {
  constructor(private readonly bajasService: BajasService) {}

  @Roles('administrador', 'usuario')
  @Post()
  create(@Body() dto: CreateBajaDto) {
    return this.bajasService.create(dto);
  }

  @Get()
  findAll(
    @Query('motivo') motivo?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.bajasService.findAll({ motivo, desde, hasta });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bajasService.findOne(id);
  }

  @Roles('administrador', 'usuario')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bajasService.remove(id);
  }
  @Get(':id/movimientos')
findWithMovimientos(
  @Param('id') id: number,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {
  return this.bajasService.findWithMovimientos(id, desde, hasta);
}
}
