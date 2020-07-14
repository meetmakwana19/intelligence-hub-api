import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AllExceptionsFilter } from '../../src/utils'; //'../../src/utils/http-exception.filter';
import { I18nService } from '../../src/utils/i18n/i18n.service';

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
  let dateNowSpy;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        I18nService,
        // {
        //     provide: I18nService,
        //     useValue: mockI18Service
        // },
      ],
    }).compile();
    service = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
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
      expect(mockCode).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend).toBeCalledWith({
        code: 400,
        error: 'Bad Request',
        method: 'get',
        path: '/',
        timestamp: 1487076708000,
      });
    });
  });
});
