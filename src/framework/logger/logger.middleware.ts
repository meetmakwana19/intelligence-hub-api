import {
  NextFunction,
  Request,
  Response,
} from 'express';
import * as onHeaders from 'on-headers';

import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { AppLogger } from './app.logger';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private appLogger = new AppLogger(AppLoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    let duration: number;

    onHeaders(response, () => {
      duration = Date.now() - startTime;
    });

    response.on('finish', () => {
      this.appLogger.log({ request, response, duration });
    });

    next();
  }
}