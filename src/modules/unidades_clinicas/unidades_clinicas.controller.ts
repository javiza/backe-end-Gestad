import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UnidadesClinicasService } from './unidades_clinicas.service';
import { CreateUnidadClinicaDto } from './dto/create-unidad_clinica.dto';
import { UpdateUnidadClinicaDto } from './dto/update-unidad_clinica.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags('unidades-clinicas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 👈 protege todos los endpoints
@Controller('unidades-clinicas')
export class UnidadesClinicasController {
  constructor(private readonly unidadesService: UnidadesClinicasService) {}

  @ApiOperation({ summary: 'Listar unidades clínicas con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.unidadesService.findAllPaginated(pageNum, limitNum);
  }

  @ApiOperation({ summary: 'Obtener unidad clínica por ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener unidad clínica con historial de movimientos' })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  @Get(':id/movimientos')
  findWithMovimientos(
    @Param('id', ParseIntPipe) id: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.unidadesService.findWithMovimientos(id, desde, hasta);
  }

@ApiOperation({ summary: 'Crear unidad clínica (solo admin)' })
@ApiResponse({ status: 201, description: 'Unidad clínica creada correctamente' })
@ApiResponse({ status: 403, description: 'No autorizado (solo admin)' })
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@HttpCode(HttpStatus.CREATED)
create(@Body() dto: CreateUnidadClinicaDto) {
  return this.unidadesService.create(dto);
}
  @ApiOperation({ summary: 'Actualizar unidad clínica (solo admin)' })
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnidadClinicaDto,
  ) {
    return this.unidadesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar unidad clínica (solo admin)' })
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.unidadesService.remove(id);
  }
}
