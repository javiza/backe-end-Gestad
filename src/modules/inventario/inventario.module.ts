import { InventariosController } from './inventario.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './inventario.entity';
import { InventariosService } from './inventario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario])],
  providers: [InventariosService],
  controllers: [InventariosController],
  exports: [InventariosService],
})
export class InventariosModule {}
