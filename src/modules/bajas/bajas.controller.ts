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

  @Roles('administrador')
  @Post()
  create(@Body() createBajaDto: CreateBajaDto) {
    return this.bajasService.create(createBajaDto);
  }

  @Get()
  findAll(
    @Query('prendaId') prendaId?: string,
    @Query('motivo') motivo?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.bajasService.findAll({ prendaId, motivo, desde, hasta });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bajasService.findOne(id);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bajasService.remove(id);
  }
}