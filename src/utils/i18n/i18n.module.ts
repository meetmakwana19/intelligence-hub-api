import { DynamicModule, Module } from '@nestjs/common';

import { I18nOptions } from './i18n.interface';
import { I18nService } from './i18n.service';

@Module({})
export class I18nModule {
  public static register(options: I18nOptions): DynamicModule {
    const service = {
      global: true,
      provide: I18nService,
      useValue: new I18nService(options),
    };

    return {
      module: I18nModule,
      providers: [service],
      exports: [service],
    };
  }
}
