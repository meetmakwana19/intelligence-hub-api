import { Logger, Module } from '@nestjs/common';

@Module({
  imports: [],
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
