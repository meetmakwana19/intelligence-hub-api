import { customProps } from './custom-props';
import { formatters } from './formatters';
import { logLevels } from './log-level';
import { serializers } from './serializers';

export const pinoHTTPLoggerOptions = (): Record<string, any> => ({
  ...logLevels(),
  ...formatters(),
  ...serializers(),
  ...customProps(),
});