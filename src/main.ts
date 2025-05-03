import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.validation';

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
  const configService = app.get(ConfigService<EnvConfig, true>);

  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
    sendDefaultPii: true,
    includeLocalVariables: true,
    tracesSampleRate: 0.5,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
