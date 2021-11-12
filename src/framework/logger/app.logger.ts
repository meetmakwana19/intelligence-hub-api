import {
  Request,
  Response,
} from 'express';
import { nanoid } from 'nanoid';

import {
  HttpStatus,
  Logger,
} from '@nestjs/common';

import {
  Network,
  REQUEST_ID_HEADER,
  USER_AGENT_HEADER,
} from './constants';

export type LogOptions = {
  request: Request,
  response?: Response,
  duration?: number
  statusCode?: number,
  bytesWritten?: number,
  error?: Error
};

export class AppLogger {
  private logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  log(options: LogOptions) {
    let { statusCode, bytesWritten } = options;
    const { request, response, error, duration } = options;

    const { method, url, ip, headers: requestHeaders } = request;

    if (statusCode === undefined) {
      statusCode = response?.statusCode;
    }

    if (bytesWritten === undefined) {
      bytesWritten = parseInt(response?.getHeader(Network.BYTES_WRITTEN_KEY) as any) || 0;
    }

    const userAgent = requestHeaders[USER_AGENT_HEADER];
    const requestId = requestHeaders[REQUEST_ID_HEADER] || nanoid();

    const bytesRead = requestHeaders[Network.BYTES_READ_KEY] || 0;

    const message = statusCode ? `${method} - ${url} ${statusCode}` : `${method} - ${url}`;

    const logObject: Record<string, any> = {
      http: {
        url,
        status_code: statusCode,
        method,
        useragent: userAgent,
        request_id: requestId
      },
      network: {
        [Network.CLIENT_IP_FIELD]: ip,
        bytes_read: bytesRead,
        bytes_written: bytesWritten
      },
      duration
    };

    if (error) {
      logObject['error'] = {
        kind: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    if (statusCode >= HttpStatus.OK && statusCode < HttpStatus.BAD_REQUEST) {
      this.logger.log(logObject, message);
    } else if (statusCode >= HttpStatus.BAD_REQUEST && statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(logObject, message);
    } else {
      this.logger.error(logObject, message);
    }
  }
}