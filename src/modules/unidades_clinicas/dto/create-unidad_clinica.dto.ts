import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadClinicaDto {
  @ApiProperty({ example: 'UCI', description: 'Nombre de la unidad clínica' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre_unidad: string;

  @ApiProperty({ example: '1234', description: 'Anexo telefónico', required: false })
  @IsOptional()
  @IsNumberString()
  @MaxLength(20)
  anexo?: string;

  @ApiProperty({ example: 'Dr. Pérez', description: 'Encargado de la unidad', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre_encargado?: string;
}
