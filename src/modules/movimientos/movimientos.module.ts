import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { Movimiento } from './movimiento.entity';
import { Prenda } from '../prendas/prendas.entity';
import { UnidadClinica } from '../unidades_clinicas/unidades_clinicas.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Baja } from '../bajas/bajas.entity';
import { Reproceso } from '../reprocesos/reproceso.entity';
import { Inventario } from '../inventario/inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movimiento,
      Prenda,
      UnidadClinica,
      Usuario,
      Baja,
      Reproceso,
      Inventario
    ]),
  ],
  providers: [MovimientosService],
  controllers: [MovimientosController],
  exports: [MovimientosService],
})
export class MovimientosModule {}