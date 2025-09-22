import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimientoDB, Operacion } from '../movimiento.entity';

export class CreateMovimientoDto {
  @ApiProperty({ example: 1, description: 'ID de la prenda' })
  @IsNotEmpty()
  @IsInt()
  id_prenda: number;

  @ApiProperty({ example: 1, description: 'Cantidad de prendas' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 'roperia', enum: TipoMovimientoDB })
  @IsEnum(TipoMovimientoDB)
  tipo_movimiento: TipoMovimientoDB;

  @ApiProperty({
    example: 'entrada',
    enum: Operacion,
    description: 'Define si el movimiento suma (entrada) o resta (salida) del stock',
  })
  @IsNotEmpty()
  @IsEnum(Operacion)
  operacion: Operacion;

  @ApiProperty({ example: 'Prenda asignada', required: false })
  @IsOptional()
  @IsString()
  observacion?: string;

  // Relacionales opcionales
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  unidadId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  bajaId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  lavanderiaId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  reprocesoId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  reparacionId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_roperia?: number;

  // Usuario que ejecuta
  @ApiProperty({ example: 1, description: 'ID del usuario que ejecuta el movimiento' })
  @IsNotEmpty()
  @IsInt()
  id_usuario: number;
}
