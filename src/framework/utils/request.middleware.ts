import { IncomingMessage, ServerResponse } from 'http';
import * as onHeaders from 'on-headers';

import { RequestLogger } from './request-logger.service';

// eslint-disable-next-line @typescript-eslint/ban-types
export function RequestMiddleware(req: IncomingMessage, res: ServerResponse, next: Function): void {
  const reqId = req.headers['id'];
  const start = Date.now();
  let runtime: number;
  RequestLogger.log(`s: 0, id: ${reqId}`);

  onHeaders(res, () => {
    runtime = Date.now() - start;
    res.setHeader('X-Runtime', runtime);
  });

  res.on('finish', () => {
    RequestLogger.log(`s: 1, id: ${reqId}, t: ${runtime}`);
  });
  return next();
}
