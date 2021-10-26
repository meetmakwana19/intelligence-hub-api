import { ServerResponse } from 'http';

export enum LogLevel {
  error = 'error',
  info = 'info'
}

export const logLevels = (): Record<string, any> => ({
  customLogLevel: (response: ServerResponse, error: Error): LogLevel => {
    if (response.statusCode >= 500 || error) {
      return LogLevel.error;
    }
    return LogLevel.info;
  },
});