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
} from '@nestjs/common';
import { UnidadesClinicasService } from './unidades_clinicas.service';
import { CreateUnidadClinicaDto } from './dto/create-unidad_clinica.dto';
import { UpdateUnidadClinicaDto } from './dto/update-unidad_clinica.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';//quizas deba sacarlo

@ApiTags('unidades-clinicas')
@ApiBearerAuth()
@Controller('unidades-clinicas')
export class UnidadesClinicasController {
  constructor(private readonly unidadesService: UnidadesClinicasService) {}

  @ApiOperation({ summary: 'Listar unidades clínicas' })
  @ApiResponse({ status: 200, description: 'Listado de unidades clínicas' })
  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener unidad clínica por id' })
  @ApiResponse({ status: 200, description: 'Unidad clínica encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad clínica no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.unidadesService.findOne(id);
  }

  @Get(':id/movimientos')
  findWithMovimientos(
  @Param('id') id: number,
  @Query('desde') desde?: string,
  @Query('hasta') hasta?: string,
) {
  return this.unidadesService.findWithMovimientos(id, desde, hasta);
}

  @ApiOperation({ summary: 'Crear unidad clínica' })
  @ApiResponse({ status: 201, description: 'Unidad clínica creada' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUnidadClinicaDto) {
    return this.unidadesService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar unidad clínica' })
  @ApiResponse({ status: 200, description: 'Unidad clínica actualizada' })
  @ApiResponse({ status: 404, description: 'Unidad clínica no encontrada' })
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUnidadClinicaDto) {
    return this.unidadesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar unidad clínica' })
  @ApiResponse({ status: 204, description: 'Unidad clínica eliminada' })
  @ApiResponse({ status: 404, description: 'Unidad clínica no encontrada' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.unidadesService.remove(id);
  }
}