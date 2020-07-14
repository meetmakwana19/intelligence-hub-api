import { Test, TestingModule } from '@nestjs/testing';

import { I18nService } from '../../src/utils/i18n/i18n.service';

describe('System header validation service', () => {
  let service: I18nService;
  let dateNowSpy;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [I18nService],
    }).compile();
    service = module.get<I18nService>(I18nService);
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
  });

  describe('i18 service tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Should return provided key if resource not present', async () => {
      const result = await service.get('en', 'noKey');
      expect(result).toEqual('noKey');
    });
    it('Should return nested key from resource file', async () => {
      const result = await service.get('en', 'header.title');
      expect(result).toEqual('English title');
    });
    it('Should return resource from fall back language', async () => {
      const result = await service.get('de', 'CHECK_FALLBACK');
      expect(result).toEqual('Check Fallback');
    });
  });
});
