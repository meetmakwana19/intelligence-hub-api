import { Test, TestingModule } from '@nestjs/testing';

import { I18nConfig } from '../../src/config/i18n.config';
import { I18nModule } from '../../src/utils';
import { I18nService } from '../../src/utils/i18n/i18n.service';

describe('System header validation service', () => {
  let service: I18nService;
  beforeAll(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [I18nModule.register(I18nConfig())],
    }).compile();
    service = module.get<I18nService>(I18nService);
    service.onApplicationBootstrap();
  });

  describe('i18 service tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Should return provided key if resource not present', () => {
      const result = service.translate('en', 'noKey');
      expect(result).toEqual('noKey');
    });
    
    it('Should return nested key from resource file', () => {
      const result = service.translate('en', 'greetings.hello_world');
      expect(result).toEqual('Hello World!');
    });

    it('Should return nested key from resource file', () => {
      const result = service.translate('en', 'greetings.hi_name', {name: 'John'});
      expect(result).toEqual('Hi John!');
    });
  });
});
