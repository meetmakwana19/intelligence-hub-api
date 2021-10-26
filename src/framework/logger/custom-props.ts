import {
  IncomingMessage,
  ServerResponse,
} from 'http';

enum Network {
  CLIENT_IP_KEY = 'client.ip',
  BYTES_READ_KEY = 'bytes_read',
  BYTES_WRITTEN_KEY = 'bytes_written',
  CLIENT_IP_FIELD = 'ip',
  BYTES_READ_FIELD = 'content-length',
  BYTES_WRITTEN_FIELD = 'content-length'
}

const MESSAGE_KEY = 'message';
const DURATION_KEY = 'duration';
const HTTP_KEY = 'http';
const TIMESTAMP_KEY = 'timestamp';

const timestamp = (): string => {
  return `,"${TIMESTAMP_KEY}":"${new Date(Date.now()).toISOString()}"`;
};

const reqCustomProps = (request: IncomingMessage, response: ServerResponse): Record<string, any> => ({
  network: {
    [Network.CLIENT_IP_KEY]: request[Network.CLIENT_IP_FIELD],
    [Network.BYTES_READ_KEY]: request.headers[Network.BYTES_READ_FIELD] || 0,
    [Network.BYTES_WRITTEN_KEY]: (response as any)?.headers?.[Network.BYTES_WRITTEN_FIELD] || 0
  }
});

export const customProps = (): Record<string, any> => ({
  base: null,
  messageKey: MESSAGE_KEY,
  timestamp,
  customAttributeKeys: { responseTime: DURATION_KEY, req: HTTP_KEY },
  reqCustomProps
});
