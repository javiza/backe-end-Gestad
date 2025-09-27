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
  ParseIntPipe 
} from '@nestjs/common';
import { ReprocesosService } from './reprocesos.service';
import { CreateReprocesoDto } from './dto/create-reproceso.dto';
import { UpdateReprocesoDto } from './dto/update-reproceso.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('reprocesos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reprocesos')
export class ReprocesosController {
  constructor(private readonly service: ReprocesosService) {}

  @ApiOperation({ summary: 'Listar reprocesos' })
  @ApiResponse({ status: 200, description: 'Listado de reprocesos' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obtener reproceso por id' })
  @ApiResponse({ status: 200, description: 'Reproceso encontrado' })
  @ApiResponse({ status: 404, description: 'Reproceso no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Crear reproceso (solo admin)' })
  @ApiResponse({ status: 201, description: 'Reproceso creado correctamente' })
  @Roles('administrador')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReprocesoDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar reproceso (solo admin)' })
  @ApiResponse({ status: 200, description: 'Reproceso actualizado' })
  @ApiResponse({ status: 404, description: 'Reproceso no encontrado' })
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReprocesoDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar reproceso (solo admin)' })
  @ApiResponse({ status: 204, description: 'Reproceso eliminado' })
  @ApiResponse({ status: 404, description: 'Reproceso no encontrado' })
  @Roles('administrador')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
