import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:8100','https://front-end-gestad.onrender.com'], // URL frontend
    credentials: true,               // permite enviar cookies o headers de autenticación
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestión Ropería Clínica API')
    .setDescription('Documentación de la API para gestión de prendas hospitalarias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

