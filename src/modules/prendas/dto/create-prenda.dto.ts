import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrendaDto {
  @ApiProperty({ example: 'Sábana', description: 'Nombre de la prenda' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Sábana de algodón 1 plaza', required: false })
  @IsOptional()
  @IsString()
  detalle?: string;

  @ApiProperty({ example: 1.2, description: 'Peso de la prenda en kg', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  peso?: number;
  
  @ApiProperty({ example: 30, description: 'Cantidad inicial en ropería', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad?: number;

}
