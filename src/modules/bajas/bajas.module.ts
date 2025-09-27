import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BajasService } from './bajas.service';
import { BajasController } from './bajas.controller';
import { Baja } from './bajas.entity';
import { Movimiento } from '../movimientos/movimiento.entity';
import { Inventario } from '../inventario/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Baja, Movimiento, Inventario])],
  controllers: [BajasController],
  providers: [BajasService],
})
export class BajasModule {}
