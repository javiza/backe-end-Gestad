import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateReparacionDto {
  @IsUUID()
  prendaId: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  veces_reparada?: number;
}
