import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadClinicaDto {
  @ApiProperty({ example: 'UCI', description: 'Nombre de la unidad clínica' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Unidad de Cuidados Intensivos', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'Dr. Pérez', required: false })
  @IsOptional()
  @IsString()
  encargado?: string;

  @ApiProperty({ example: '+56987654321', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'uci@clinica.cl', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;
}