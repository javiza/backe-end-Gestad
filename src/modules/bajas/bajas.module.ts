import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BajasService } from './bajas.service';
import { BajasController } from './bajas.controller';
import { Baja } from './bajas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';
import { InventarioGeneral } from '../inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Baja, Movimiento, InventarioGeneral])],
  controllers: [BajasController],
  providers: [BajasService],
})
export class BajasModule {}
