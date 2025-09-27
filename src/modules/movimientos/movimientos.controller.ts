import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('movimientos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly service: MovimientosService) {}

  @ApiOperation({ summary: 'Listar movimientos con paginación' })
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.findAllPaginated(Number(page), Number(limit));
  }

  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

    @ApiOperation({ summary: 'Registrar un nuevo movimiento' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMovimientoDto, @Req() req: any) {
    const userId = req.user.sub; //  token JWT
    return this.service.create(dto, userId);
  }

  @ApiOperation({ summary: 'Eliminar un movimiento' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
