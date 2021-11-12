const MESSAGE_KEY = 'message';
const DURATION_KEY = 'duration';
const TIMESTAMP_KEY = 'timestamp';

const timestamp = (): string => {
  return `,"${TIMESTAMP_KEY}":"${new Date(Date.now()).toISOString()}"`;
};

export const customProps = (): Record<string, any> => ({
  base: null,
  messageKey: MESSAGE_KEY,
  timestamp,
  customAttributeKeys: { responseTime: DURATION_KEY },
});
