import { MongoDBFactory } from '@contentstack/mongodb';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TodoModule } from './app/todo/todo.module';
import { loadConfig, MongoDBConfig } from './framework/config';
import { I18nConfig } from './framework/config/i18n.config';
import { APP_DB } from './framework/utils';
import { I18nModule } from './framework/utils/i18n/i18n.module';

@Module({
  imports: [ConfigModule.forRoot(loadConfig()), I18nModule.register(I18nConfig()), MongoDBFactory.connect(MongoDBConfig()(APP_DB)), TodoModule],
  controllers: [],
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
