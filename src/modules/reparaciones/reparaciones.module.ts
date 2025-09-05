import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReparacionesService } from './reparaciones.service';
import { ReparacionesController } from './reparaciones.controller';
import { Reparacion } from './reparaciones.entity';
import { Prenda } from '../prendas/prendas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reparacion, Prenda])],
  providers: [ReparacionesService],
  controllers: [ReparacionesController],
})
export class ReparacionesModule {}