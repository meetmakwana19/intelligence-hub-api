import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { TodoModule } from '../todo/todo.module';
import { configuration, validationSchema } from './configuration';
import { HealthController } from './health/health.controller';
import { MongooseConfigService } from './mongoose-config.service';

@Module({
  imports: [
    TodoModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema,
      expandVariables: true,
    }),
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
