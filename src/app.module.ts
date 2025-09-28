import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { UnidadesClinicasModule } from './modules/unidades_clinicas/unidades_clinicas.module';
import { PrendasModule } from './modules/prendas/prendas.module';
import { MovimientosModule } from './modules/movimientos/movimientos.module';
import { BajasModule } from './modules/bajas/bajas.module';
import { ReprocesosModule } from './modules/reprocesos/reprocesos.module';
import { InventariosModule } from './modules/inventario/inventario.module';
import { ReparacionModule } from './modules/reparacion/reparacion.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, 
    }),
    UsuariosModule,
    AuthModule,
    UnidadesClinicasModule,
    PrendasModule,
    InventariosModule, 
    MovimientosModule,
    ReprocesosModule,
    BajasModule,
    ReparacionModule,
  ],
})
export class AppModule {}
