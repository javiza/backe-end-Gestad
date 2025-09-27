import { IsNotEmpty, IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoEntidad } from '../movimiento.entity';

export class CreateMovimientoDto {
  @ApiProperty({ example: 'sabana' })
  @IsNotEmpty()
  @IsString()
  nombre_prenda: string; 
  
  // @ApiProperty({ example: 1 })
  // @IsNotEmpty()
  // @IsInt()
  // id_prenda: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ enum: TipoEntidad })
  @IsNotEmpty()
  @IsEnum(TipoEntidad)
  desde_tipo: TipoEntidad;

  @ApiProperty({ example: 2, required: false, description: 'Solo si desde_tipo = unidad' })
  @IsOptional()
  @IsInt()
  desde_id_unidad?: number;

  @ApiProperty({ enum: TipoEntidad })
  @IsNotEmpty()
  @IsEnum(TipoEntidad)
  hacia_tipo: TipoEntidad;

  @ApiProperty({ example: 3, required: false, description: 'Solo si hacia_tipo = unidad' })
  @IsOptional()
  @IsInt()
  hacia_id_unidad?: number;

  @ApiProperty({ required: false, example: 'Traslado de ropa sucia a lavandería' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  // @ApiProperty({ example: 1 })
  // @IsNotEmpty()
  // @IsInt()
  // id_usuario: number;
}
