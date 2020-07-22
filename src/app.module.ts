import { MongoDBFactory } from '@contentstack/mongodb';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './app/health/health.controller';
import { TodoModuleMongoDB } from './app/todo-mongodb/todo.module';
import { TodoModuleMoongoose } from './app/todo-mongoose/todo.module';
import { loadConfig, MongoDBConfig } from './framework/config';
import { I18nConfig } from './framework/config/i18n.config';
import { MongooseConfigService } from './framework/config/mongoose-config.service';
import { APP_DB } from './framework/utils';
import { I18nModule } from './framework/utils/i18n/i18n.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot(loadConfig()),
    I18nModule.register(I18nConfig()),
    MongoDBFactory.connect(MongoDBConfig()(APP_DB)),
    MongooseModule.forRoot('mongodb://localhost/todo'),
    TodoModuleMongoDB,
    TodoModuleMoongoose,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {
  onApplicationBootstrap(): void {
    Logger.log('Loading app module...');
  }

  onApplicationShutdown(): void {
    Logger.log('Shutting down app module...');
  }
}