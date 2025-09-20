import { PartialType } from '@nestjs/swagger';
import { CreateReprocesoDto } from './create-reproceso.dto';

export class UpdateReprocesoDto extends PartialType(CreateReprocesoDto) {}
