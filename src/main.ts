import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true,  // renvoie une erreur si un champ inconnu est envoyé
      transform: true,             // transforme le body brut en instance du DTO
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription(
      "API documentation pour l'application de gestion immobilière)",
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log("serveur lance suir "+process.env.PORT);
}
bootstrap();
