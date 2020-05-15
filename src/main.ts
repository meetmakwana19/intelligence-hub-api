import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { validationPipe } from './app/validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalPipes(validationPipe);
  app.enableShutdownHooks();
  await app.listen(configService.get<number>('port') as number);
}
bootstrap();
