import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, IsNumber, IsOptional } from 'class-validator';

export class CreatePrendaConMovimientoDto {
  @ApiProperty({ example: 'Pantalón' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pantalón de algodón azul', required: false })
  @IsString()
  @IsOptional()
  detalle?: string;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @Min(0.1)
  peso: number;

  @ApiProperty({ example: 'verde' })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que realiza el ingreso', required: false })
  @IsInt()
  @IsOptional()
  id_usuario?: number;

  @ApiProperty({ example: 1, description: 'ID de la ropería donde se ingresará la prenda', required: false })
  @IsInt()
  @IsOptional()
  id_roperia?: number; 
}
