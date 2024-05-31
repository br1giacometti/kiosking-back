import { NestFactory } from '@nestjs/core';
import { AppModule } from 'Base/module/AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Viajauto is running on ${process.env.PORT || 3000}`);
}

bootstrap();
