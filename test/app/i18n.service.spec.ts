import { Test, TestingModule } from '@nestjs/testing';

import { I18nService } from '../../src/utils/i18n/i18n.service';
import { I18nModule } from '../../src/utils';
import { I18nConfig } from '../../src/config/i18n.config';

describe('System header validation service', () => {
  let service: I18nService;
  let dateNowSpy;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports:[I18nModule.register(I18nConfig())]
      // providers: [I18nService],
    }).compile();
    service = module.get<I18nService>(I18nService);
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
  });

  describe('i18 service tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('Should return provided key if resource not present', async () => {
      const result = await service.translate('en', 'noKey');
      expect(result).toEqual('noKey');
    });
    it('Should return nested key from resource file', async () => {
      const result = await service.translate('en', 'greetings.hello_world');
      expect(result).toEqual('Hello World!');
    });
  });
});
