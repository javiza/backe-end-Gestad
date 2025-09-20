import { PartialType } from '@nestjs/swagger';
import { CreateRoperiaDto } from './create-roperia.dto';

export class UpdateRoperiaDto extends PartialType(CreateRoperiaDto) {}
