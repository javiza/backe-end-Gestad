import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateBajaDto {
  @IsNotEmpty()
  motivo: string;
}

