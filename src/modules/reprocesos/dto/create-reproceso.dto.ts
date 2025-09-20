import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReprocesoDto {
  @ApiProperty({ example: 'Reproceso por manchas' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 'Carlos López', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  responsable?: string;
}
