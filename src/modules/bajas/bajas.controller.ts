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
import { BajasService } from './bajas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBajaDto } from './dto/create-baja.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('bajas')
@ApiBearerAuth()
@Controller('bajas')
export class BajasController {
  constructor(private readonly bajasService: BajasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'usuario')
  @ApiOperation({ summary: 'Registrar una nueva baja de prenda' })
  @ApiResponse({ status: 201, description: 'Baja registrada correctamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(@Body() dto: CreateBajaDto) {
    return this.bajasService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar bajas con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Listado de bajas' })
  findAll(
    @Query('motivo') motivo?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.bajasService.findAll({ motivo, desde, hasta });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una baja por ID' })
  @ApiResponse({ status: 200, description: 'Baja encontrada' })
  @ApiResponse({ status: 404, description: 'Baja no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bajasService.findOne(id);
  }

  @Get(':id/movimientos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener baja con movimientos asociados' })
  @ApiResponse({ status: 200, description: 'Baja y sus movimientos' })
  @ApiResponse({ status: 404, description: 'Baja no encontrada' })
  findWithMovimientos(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.bajasService.findWithMovimientos(id, desde, hasta);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'usuario')
  @ApiOperation({ summary: 'Eliminar una baja (solo si no hay movimientos)' })
  @ApiResponse({ status: 204, description: 'Baja eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Baja no encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bajasService.remove(id);
  }
}
