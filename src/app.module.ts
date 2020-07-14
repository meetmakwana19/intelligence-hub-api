import { Logger, Module } from '@nestjs/common';
import * as path from 'path';

import { TodoModule } from './todo/todo.module';
import { I18nModule } from './utils/i18n/i18n.module';

@Module({
  imports: [
    I18nModule.register({
      masterLanguage: 'en',
      messagesPath: path.resolve(__dirname, './resources/messages'),
    }),
    TodoModule,
  ],
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
