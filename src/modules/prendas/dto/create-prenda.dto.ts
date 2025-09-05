import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrendaDto {
  @ApiProperty({ example: 'Bata', description: 'Nombre de la prenda' })
  @IsNotEmpty()
  @IsString()
  nombre_prenda: string;

  @ApiProperty({ example: 50, description: 'Cantidad inicial' })
  @IsInt()
  @Min(0)
  cantidad: number;

  @ApiProperty({ example: 'Talla M', required: false })
  @IsOptional()
  @IsString()
  detalle?: string;

  @ApiProperty({ example: 'Uniforme', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;
}