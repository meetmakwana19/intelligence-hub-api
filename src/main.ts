import { Logger as PinoLogger } from 'nestjs-pino';

import {
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  I18nService,
  TimeoutInterceptor,
} from './framework/utils';

async function bootstrap() {
  const logger = new Logger('ApplicationBootstrap');
  const fastify = new FastifyAdapter({});

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);

  app.useLogger(app.get(PinoLogger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(new TimeoutInterceptor(1000));

  app.useGlobalFilters(new AllExceptionsFilter(app.get<I18nService>(I18nService)));

  app.enableShutdownHooks(['SIGTERM', 'SIGINT', 'SIGHUP', 'uncaughtException', 'unhandledRejection']);

  logger.log('Starting API...', 'APILogger');

  await app.listen(Number(process.env.PORT) || 3000);
}

bootstrap();
