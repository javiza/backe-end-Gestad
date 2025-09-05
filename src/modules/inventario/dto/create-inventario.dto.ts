import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateInventarioDto {
  @IsUUID()
  id_prenda: string;

  @IsInt()
  @Min(0)
  cantidad_stock: number;
}