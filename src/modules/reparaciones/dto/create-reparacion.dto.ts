
import { IsOptional, IsString } from 'class-validator';

export class CreateReparacionDto {
  @IsString()
  descripcion: string;

  @IsOptional()
  fecha_fin?: Date;
}
