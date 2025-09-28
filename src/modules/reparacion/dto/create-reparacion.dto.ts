import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReparacionDto {
  @ApiProperty({ example: 1, description: 'ID de la prenda afectada' })
  @IsInt()
  @Type(() => Number)
  id_prenda: number;

  @ApiProperty({ example: 5, description: 'Cantidad dada de reparación' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 'Prenda dañada', description: 'Descripción de la reparación' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
