import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PrendasService } from './prendas.service';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('prendas')
@ApiBearerAuth()
@Controller('prendas')
export class PrendasController {
  constructor(private readonly prendasService: PrendasService) {}

  @ApiOperation({ summary: 'Listar prendas' })
  @ApiResponse({ status: 200, description: 'Listado de prendas' })
  @Get()
  findAll() {
    return this.prendasService.findAll();
  }

  @ApiOperation({ summary: 'Obtener prenda por id' })
  @ApiResponse({ status: 200, description: 'Prenda encontrada' })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePrendaDto) {
    return this.prendasService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar prenda' })
  @ApiResponse({ status: 204, description: 'Prenda eliminada' })
  @ApiResponse({ status: 404, description: 'Prenda no encontrada' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.prendasService.remove(id);
  }
}