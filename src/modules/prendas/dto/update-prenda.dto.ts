import { PartialType } from '@nestjs/swagger';
import { CreatePrendaDto } from './create-prenda.dto';

export class UpdatePrendaDto extends PartialType(CreatePrendaDto) {}
