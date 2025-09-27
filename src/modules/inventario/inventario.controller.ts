import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { InventariosService } from './inventario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario-dto';

@ApiTags('inventarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}

  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo registro de inventario' })
  create(@Body() dto: CreateInventarioDto) {
    return this.inventariosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar inventario paginado' })
  getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return this.inventariosService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inventario por ID' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventariosService.findOne(id);
  }

  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar inventario' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventarioDto,
  ) {
    return this.inventariosService.update(id, dto);
  }

  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar inventario' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventariosService.remove(id);
  }

  @Get('stock/:id_prenda')
  @ApiOperation({ summary: 'Consultar stock de una prenda en un contexto' })
  getStock(
    @Param('id_prenda', ParseIntPipe) id_prenda: number,
    @Query('tipo') tipo_entidad: string,
    @Query('id_unidad') id_unidad?: number,
  ) {
    return this.inventariosService.getStock(id_prenda, tipo_entidad, id_unidad);
  }
  @Get('buscar/nombre')
@ApiOperation({ summary: 'Buscar inventario por nombre de prenda' })
async buscarPorNombre(@Query('nombre') nombre: string) {
  if (!nombre) {
    throw new BadRequestException('Debe enviar el nombre de la prenda');
  }
  return this.inventariosService.buscarPorNombre(nombre);
}
}