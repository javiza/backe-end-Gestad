import { IsInt, Min, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventarioDto {
  @ApiProperty({ example: 1, description: 'ID de la prenda' })
  @IsInt()
  @Type(() => Number)
  id_prenda: number;

  @ApiProperty({
    example: 'roperia',
    description: 'Entidad a la que pertenece el inventario',
    enum: ['roperia', 'lavanderia', 'unidad', 'reproceso', 'baja'],
  })
  @IsIn(['roperia', 'lavanderia', 'unidad', 'reproceso', 'baja'])
  tipo_entidad: 'roperia' | 'lavanderia' | 'unidad' | 'reproceso' | 'baja';

  @ApiPropertyOptional({
    example: 2,
    description: 'ID de la unidad clínica (solo si tipo_entidad = "unidad")',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id_unidad?: number;

  @ApiProperty({ example: 10, description: 'Cantidad a registrar (debe ser >= 0)' })
  @IsInt()
  @Min(0)
  cantidad: number;
}
