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
  UseGuards,
} from '@nestjs/common';
import { ReparacionesService } from './reparaciones.service';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateReparacionDto } from './dto/update-reparacion.dto';

@Controller('reparaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReparacionesController {
  constructor(private readonly reparacionesService: ReparacionesService) {}

  /** Crear reparación */
  @Roles('administrador','usuarios')
  @Post()
  create(@Body() dto: CreateReparacionDto) {
    return this.reparacionesService.create(dto);
  }

  /** Listar reparaciones con filtros de fecha y paginación */
  @Get()
  findAll(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reparacionesService.findAll({
      desde,
      hasta,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /** Buscar reparación por ID */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reparacionesService.findOne(id);
  }

  /** Actualizar reparación */
 @Roles('administrador', 'usuarios')
@Put(':id')
update(@Param('id') id: number, @Body() dto: UpdateReparacionDto) {
  return this.reparacionesService.update(id, dto);
}

  /** Eliminar reparación */
  @Roles('administrador', 'usuarios')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.reparacionesService.remove(id);
  }
  // buscar movimiento por id
  @Get(':id/movimientos')
findWithMovimientos(
  @Param('id') id: number,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {
  return this.reparacionesService.findWithMovimientos(id, desde, hasta);
}
}
