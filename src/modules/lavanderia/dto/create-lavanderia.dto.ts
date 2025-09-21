
import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

export class CreateLavanderiaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{7,8}-[0-9kK]{1}$/, { message: 'RUT inválido' })
  rut: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
