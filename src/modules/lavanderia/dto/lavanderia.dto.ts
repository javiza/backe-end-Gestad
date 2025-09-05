import { IsUUID, IsOptional, IsEnum, IsString } from 'class-validator';
import { EstadoLavado } from '../lavanderia.entity';

export class IngresarLavadoDto {
  @IsUUID()
  id_prenda: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}

export class ActualizarEstadoDto {
  @IsEnum(EstadoLavado)
  estado: EstadoLavado;

  @IsOptional()
  @IsString()
  observacion?: string;
}