import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Gestión Ropería Clínica API')
    .setDescription('Documentación de la API para gestión de prendas hospitalarias')
    .setVersion('1.0')
    .addBearerAuth() // Para endpoints protegidos con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
 
}
bootstrap();
