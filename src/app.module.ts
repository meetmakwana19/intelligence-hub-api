import { Logger, Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],
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
