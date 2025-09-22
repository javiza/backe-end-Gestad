import { Module } from '@nestjs/common';
import { PrendasService } from './prendas.service';
import { PrendasController } from './prendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prenda } from './prendas.entity';
import { MovimientosModule } from '../movimientos/movimientos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prenda]), MovimientosModule],
  providers: [PrendasService],
  controllers: [PrendasController]
})
export class PrendasModule {}
