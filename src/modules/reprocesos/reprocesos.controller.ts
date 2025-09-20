import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ReprocesosService } from './reprocesos.service';
import { CreateReprocesoDto } from './dto/create-reproceso.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reprocesos')
@Controller('reprocesos')
export class ReprocesosController {
  constructor(private readonly service: ReprocesosService) {}

  @ApiOperation({ summary: 'Listar reprocesos' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obtener reproceso por id' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Crear reproceso' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReprocesoDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Eliminar reproceso' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.service.remove(id);
  }
  @Get(':id/movimientos')
findWithMovimientos(
  @Param('id') id: number,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {
  return this.service.findWithMovimientos(id, desde, hasta);
}
}
