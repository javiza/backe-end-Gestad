import { PartialType } from '@nestjs/mapped-types';
import { CreateReparacionDto } from './create-reparacion.dto';

export class UpdateReparacionDto extends PartialType(CreateReparacionDto) {}
