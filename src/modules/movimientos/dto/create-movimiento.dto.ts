import { IsNotEmpty, IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimiento } from '../movimiento.entity';

export class CreateMovimientoDto {
  @ApiProperty({ example: 'uuid-prenda', description: 'ID de la prenda' })
  @IsNotEmpty()
  @IsString()
  prendaId: string;

  @ApiProperty({ example: 1, description: 'Cantidad de prendas' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 'ingreso', enum: TipoMovimiento })
  @IsEnum(TipoMovimiento)
  tipo_movimiento: TipoMovimiento;

  @ApiProperty({ example: 'uuid-unidad', required: false })
  @IsOptional()
  @IsString()
  unidadId?: string;

  @ApiProperty({ example: 'uuid-usuario', required: false })
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @ApiProperty({ example: 'Prenda asignada', required: false })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiProperty({ example: 'uuid-baja', required: false })
  @IsOptional()
  @IsString()
  bajaId?: string;

  @ApiProperty({ example: 'uuid-lavanderia', required: false })
  @IsOptional()
  @IsString()
  lavanderiaId?: string;
}