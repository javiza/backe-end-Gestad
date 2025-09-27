import { IsNotEmpty, IsOptional, IsString, Length, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReprocesoDto {
  @ApiProperty({ example: 1, description: 'ID de la prenda asociada' })
  @IsNotEmpty()
  @IsInt()
  id_prenda: number;

  @ApiProperty({ example: 10, description: 'Cantidad de prendas en reproceso' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 'Reproceso por manchas', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'Carlos López', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  responsable?: string;
}
