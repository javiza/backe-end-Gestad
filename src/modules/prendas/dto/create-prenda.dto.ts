import { IsNotEmpty, IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrendaDto {
  @ApiProperty({ example: 'Bata', description: 'Nombre de la prenda' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Talla M', required: false })
  @IsOptional()
  @IsString()
  detalle?: string;

  @ApiProperty({ example: 0.5, description: 'Peso en kilogramos', required: false })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiProperty({ example: 'Verde', description: 'Tipo de prenda' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tipo: string;
}
