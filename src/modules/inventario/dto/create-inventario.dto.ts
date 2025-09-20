import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventarioDto {
  @IsInt()
  @Type(() => Number)   // convierte string → number automáticamente en las requests
  id_prenda: number;

  @IsInt()
  @Min(0)
  cantidad: number;
}
