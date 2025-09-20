import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roperia } from './roperia.entity';
import { RoperiasService } from './roperias.service';
import { RoperiasController } from './roperias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Roperia])],
  controllers: [RoperiasController],
  providers: [RoperiasService],
  exports: [RoperiasService],
})
export class RoperiasModule {}
