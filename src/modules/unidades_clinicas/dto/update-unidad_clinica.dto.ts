import { PartialType } from '@nestjs/swagger';
import { CreateUnidadClinicaDto } from './create-unidad_clinica.dto';

export class UpdateUnidadClinicaDto extends PartialType(CreateUnidadClinicaDto) {}