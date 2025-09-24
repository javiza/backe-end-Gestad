import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';//swagger

@ApiTags('movimientos')
@ApiBearerAuth()
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @ApiOperation({ summary: 'Listar movimientos' })
  @ApiResponse({ status: 200, description: 'Listado de movimientos' })
  @Get()
  findAll() {
    return this.movimientosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener movimiento por id' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
 @Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.movimientosService.findOne(id);
}

  @ApiOperation({ summary: 'Crear movimiento' })
  @ApiResponse({ status: 201, description: 'Movimiento creado' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMovimientoDto) {
    return this.movimientosService.create(dto);
  }

  @ApiOperation({ summary: 'Eliminar movimiento' })
  @ApiResponse({ status: 204, description: 'Movimiento eliminado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  @Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  await this.movimientosService.remove(id);
}
}