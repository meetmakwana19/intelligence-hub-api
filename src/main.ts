import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { AllExceptionsFilter, TimeoutInterceptor,I18nService } from './utils';

async function bootstrap() {
  const fastify = new FastifyAdapter({});

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);

  app.useGlobalInterceptors(new TimeoutInterceptor(100));

  app.useGlobalFilters(new AllExceptionsFilter(new I18nService));

  app.enableShutdownHooks(['SIGTERM', 'SIGINT', 'SIGHUP', 'uncaughtException', 'unhandledRejection']);

  Logger.log('Starting API...', 'APILogger');

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
