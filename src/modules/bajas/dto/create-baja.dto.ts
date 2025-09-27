import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBajaDto {
  @ApiProperty({ example: 1, description: 'ID de la prenda afectada' })
  @IsInt()
  @Type(() => Number)
  id_prenda: number;

  @ApiProperty({ example: 5, description: 'Cantidad dada de baja' })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 'Prenda dañada', description: 'Motivo de la baja' })
  @IsNotEmpty()
  @IsString()
  motivo: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Responsable de la baja', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  responsable?: string;
}
