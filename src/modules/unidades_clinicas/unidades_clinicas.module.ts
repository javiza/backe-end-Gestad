import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesClinicasService } from './unidades_clinicas.service';
import { UnidadesClinicasController } from './unidades_clinicas.controller';
import { UnidadClinica } from './unidades_clinicas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadClinica])],
  providers: [UnidadesClinicasService],
  controllers: [UnidadesClinicasController],
})
export class UnidadesClinicasModule {}