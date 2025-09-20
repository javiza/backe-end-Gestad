import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RoperiasService } from './roperias.service';
import { CreateRoperiaDto } from './dto/create-roperia.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('roperias')
@Controller('roperias')
export class RoperiasController {
  constructor(private readonly service: RoperiasService) {}

  @ApiOperation({ summary: 'Listar roperías' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obtener ropería por id' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Crear ropería' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRoperiaDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Eliminar ropería' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.service.remove(id);
  }
  // roperia.controller.ts
@Get(':id/movimientos')
findWithMovimientos(
  @Param('id') id: number,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {
  return this.service.findWithMovimientos(id, desde, hasta);
}

}
