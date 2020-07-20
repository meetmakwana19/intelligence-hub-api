import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { I18nConfig } from '../../../src/framework/config/i18n.config';
import { AllExceptionsFilter, I18nModule, I18nService } from '../../../src/framework/utils'; //'../../src/utils/http-exception.filter';

const mockSend = jest.fn();
const mockCode = jest.fn().mockImplementation(() => ({
  send: mockSend,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  code: mockCode,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  req: {
    url: '/',
    method: 'get',
  },
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let service: AllExceptionsFilter;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [I18nModule.register(I18nConfig())],
      providers: [AllExceptionsFilter],
    }).compile();
    service = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    const i18n = module.get<I18nService>(I18nService);
    i18n.onApplicationBootstrap();
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http exception', async () => {
      await service.catch(new HttpException('Http exception', HttpStatus.BAD_REQUEST), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockCode).toBeCalledTimes(1);
      expect(mockCode).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend).toBeCalledWith({
        error_message: '//TODO: check ./utils/all-exception.filter.ts',
      });
    });
  });
});
