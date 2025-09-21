
import { IsString, Matches, IsOptional } from 'class-validator';

export class UpdateLavanderiaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]{1}$/, { message: 'RUT inválido' })
  rut?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
