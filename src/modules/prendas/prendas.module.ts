import { Module } from '@nestjs/common';
import { PrendasService } from './prendas.service';
import { PrendasController } from './prendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prenda } from './prendas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prenda])],
  providers: [PrendasService],
  controllers: [PrendasController]
})
export class PrendasModule {}
