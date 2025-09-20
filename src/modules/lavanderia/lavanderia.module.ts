import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LavanderiaService } from './lavanderia.service';
import { LavanderiaController } from './lavanderia.controller';
import { Lavanderia } from './lavanderia.entity';
import { Movimiento } from '../movimientos/movimiento.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Lavanderia, Movimiento])],
  providers: [LavanderiaService],
  controllers: [LavanderiaController],
})
export class LavanderiaModule {}