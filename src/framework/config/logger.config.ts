import * as Joi from '@hapi/joi';

export const loggerConfig = (): Record<string, any> => ({
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

export const loggerValidationSchema = {
  LOG_LEVEL: Joi.string()
};
