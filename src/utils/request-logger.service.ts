import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class RequestLogger implements LoggerService {
  log(message: string): void {
    RequestLogger.printMessage(message);
  }

  error(message: string): void {
    RequestLogger.printMessage(message, true);
  }

  warn(message: string): void {
    RequestLogger.printMessage(message);
  }

  debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      RequestLogger.printMessage(message);
    }
  }

  static log(message: string): void {
    RequestLogger.printMessage(message);
  }

  static error(message: string): void {
    RequestLogger.printMessage(message, true);
  }

  static warn(message: string): void {
    RequestLogger.printMessage(message);
  }

  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      RequestLogger.printMessage(message);
    }
  }

  private static printMessage(message: string, err?: boolean): void {
    const std = process[err ? 'stderr' : 'stdout'];
    std.write(`${message}\n`);
  }
}
