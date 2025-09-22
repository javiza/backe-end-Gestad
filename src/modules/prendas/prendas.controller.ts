import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PrendasService } from './prendas.service';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreatePrendaConMovimientoDto } from './dto/create-prenda-con-movimiento.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags('prendas')
@ApiBearerAuth()
@Controller('prendas')
export class PrendasController {
  constructor(private readonly prendasService: PrendasService) {}

  @ApiOperation({ summary: 'Listar prendas' })
  @ApiResponse({ status: 200, description: 'Listado de prendas' })
  @Get()
  findAll(@Query('nombre') nombre?: string) {
    return this.prendasService.findAll(nombre);
  }

  @ApiOperation({ summary: 'Obtener prenda por id (incluye inventario)' })
  @ApiResponse({ status: 200, description: 'Prenda encontrada' })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prendasService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear prenda' })
  @ApiResponse({ status: 201, description: 'Prenda creada' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePrendaDto) {
    return this.prendasService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar prenda' })
  @ApiResponse({ status: 200, description: 'Prenda actualizada' })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrendaDto,
  ) {
    return this.prendasService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar prenda' })
  @ApiResponse({ status: 204, description: 'Prenda eliminada' })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.prendasService.remove(id);
  }

  @ApiOperation({ summary: 'Obtener prenda con historial de movimientos' })
  @ApiResponse({
    status: 200,
    description: 'Prenda con su historial de movimientos',
  })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Get(':id/movimientos')
  findWithMovimientos(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.prendasService.findWithMovimientos(id, desde, hasta);
  }
@Post('ingresar')
@UseGuards(JwtAuthGuard) // 🔒 protege la ruta con JWT
@ApiOperation({ summary: 'Crear prenda y registrar movimiento en ropería' })
@ApiResponse({ status: 201, description: 'Prenda creada con su primer movimiento' })
@ApiResponse({ status: 400, description: 'Error en los datos enviados' })
async createWithMovimiento(
  @Body() dto: CreatePrendaConMovimientoDto,
  @Req() req,
) {
  console.log('DTO recibido:', dto);
  console.log('usuario autenticado:', req.user);

  const userId = req.user.id; // id del usuario autenticado (payload JWT)
  const result = await this.prendasService.createWithMovimiento(dto, userId);

  return {
    message: 'Prenda creada y movimiento registrado en ropería',
    prenda: result.prenda,
    fechaMovimiento: result.movimiento.fecha,
  };
}

}
