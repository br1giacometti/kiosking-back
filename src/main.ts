import { NestFactory } from '@nestjs/core';
import { AppModule } from 'Base/module/AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://cereales-front.vercel.app'], // Corregir el origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Cereales ducret is running on ${process.env.PORT || 3000}`);
}

bootstrap();
