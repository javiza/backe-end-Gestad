import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReparacionService } from './reparacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateReparacionDto } from './dto/create-reparacion.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('reparaciones')
@ApiBearerAuth()
@Controller('reparaciones')
export class ReparacionController {
  constructor(private readonly reparacionService: ReparacionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'usuario')
  @ApiOperation({ summary: 'Registrar una nueva reparación de prenda' })
  @ApiResponse({ status: 201, description: 'Reparación registrada correctamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(@Body() dto: CreateReparacionDto) {
    return this.reparacionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar reparacion con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Listado de reparaciones' })
  findAll(
    @Query('descripcion') descripcion?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.reparacionService.findAll({ descripcion, desde, hasta });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una reparación por ID' })
  @ApiResponse({ status: 200, description: 'Reparación encontrada' })
  @ApiResponse({ status: 404, description: 'Reparación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reparacionService.findOne(id);
  }

  @Get(':id/movimientos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener reparación con movimientos asociados' })
  @ApiResponse({ status: 200, description: 'Reparación y sus movimientos' })
  @ApiResponse({ status: 404, description: 'Reparación no encontrada' })
  findWithMovimientos(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.reparacionService.findWithMovimientos(id, desde, hasta);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'usuario')
  @ApiOperation({ summary: 'Eliminar una baja (solo si no hay movimientos)' })
  @ApiResponse({ status: 204, description: 'Baja eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Baja no encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reparacionService.remove(id);
  }
}
