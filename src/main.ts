import '@/instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(compression());
  // app.enableCors({
  //   origin: ['https://heramc.net'],
  //   methods: ['GET', 'POST'],
  //   credentials: true,
  // });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
