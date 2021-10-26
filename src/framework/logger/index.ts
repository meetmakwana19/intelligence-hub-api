import PinoHttp from 'pino-http';

import { customProps } from './custom-props';
import { formatters } from './formatters';
import { logLevels } from './log-level';
import { serializers } from './serializers';

export const pinoHTTPLoggerOptions = (): PinoHttp.Options => ({
  ...logLevels(),
  ...formatters(),
  ...serializers(),
  ...customProps(),
});