import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { LavanderiaService } from './lavanderia.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateLavanderiaDto } from './dto/create-lavanderia.dto';
import { UpdateLavanderiaDto } from './dto/update-lavanderia.dto';

@Controller('lavanderias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LavanderiaController {
  constructor(private readonly lavanderiaService: LavanderiaService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateLavanderiaDto) {
    return this.lavanderiaService.create(dto);
  }

  @Get()
  findAll(@Query('nombre') nombre?: string) {
    return this.lavanderiaService.findAll(nombre);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.lavanderiaService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLavanderiaDto) {
    return this.lavanderiaService.update(id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.lavanderiaService.remove(id);
  }
  @Get(':id/movimientos')
  findWithMovimientos(@Param('id') id: number) {
  return this.lavanderiaService.findWithMovimientos(id);
}
}
