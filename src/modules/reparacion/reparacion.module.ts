import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReparacionService } from './reparacion.service';
import { ReparacionController } from './reparacion.controller';
import { Reparacion } from './reparacion.entity';
import { Movimiento } from '../movimientos/movimiento.entity';
import { Inventario } from '../inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reparacion, Movimiento, Inventario])],
  controllers: [ReparacionController],
  providers: [ReparacionService],
})
export class ReparacionModule {}
