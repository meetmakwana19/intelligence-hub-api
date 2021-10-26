import { Params } from 'nestjs-pino';

import { ConfigService } from '@nestjs/config';

import { pinoHTTPLoggerOptions } from '../logger';

export function LoggerConfigService(configService: ConfigService): Params {
  const DEFAULT_LOG_LEVEL = "info";
  const logLevel = configService.get<string>('logger.level') || DEFAULT_LOG_LEVEL;

  return {
    pinoHttp: { level: logLevel, ...pinoHTTPLoggerOptions() },
  };
}