import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateBajaDto {
  @IsUUID()
  id_prenda: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNotEmpty()
  motivo: string;
}
