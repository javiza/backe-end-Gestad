import { Type } from 'class-transformer';
import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateReparacionDto {
  @IsString()
  descripcion: string;

  @IsOptional()
  fecha_fin?: Date;
}
