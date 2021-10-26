import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';

const REQUEST_ID_HEADER = 'x-request-id';
const USER_AGENT_HEADER = 'user-agent';

const requestSerializer = (request: IncomingMessage): Record<string, string | number> => {
  const { url, statusCode, method, headers: requestHeaders } = request;
  const requestId = requestHeaders[REQUEST_ID_HEADER] || uuidv4();

  return {
    url,
    status_code: statusCode,
    method,
    useragent: requestHeaders[USER_AGENT_HEADER],
    request_id: requestId as string
  };
};

const responseSerializer = () => {
  return;
};

export const serializers = (): Record<string, any> => ({
  serializers: {
    req: requestSerializer,
    res: responseSerializer,
  }
});