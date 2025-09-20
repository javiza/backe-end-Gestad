import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reproceso } from './reproceso.entity';
import { ReprocesosService } from './reprocesos.service';
import { ReprocesosController } from './reprocesos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reproceso])],
  controllers: [ReprocesosController],
  providers: [ReprocesosService],
  exports: [ReprocesosService],
})
export class ReprocesosModule {}
