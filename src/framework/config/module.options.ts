import * as path from 'path';

import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import {
  loggerConfig,
  loggerValidationSchema,
} from './logger.config';
import { MongoDBConfig } from './mongodb.config';
import {
  mongooseConfig,
  mongooseValidationSchema,
} from './mongoose.config';

export function loadConfig(): ConfigModuleOptions {
  return {
    envFilePath: path.join(__dirname, '../../..', (process.env.NODE_ENV || 'development') + '.env'),
    load: [
      MongoDBConfig,
      mongooseConfig,
      loggerConfig,
    ],
    validationSchema: Joi.object(mongooseValidationSchema)
      .append(loggerValidationSchema),
    expandVariables: true,
  };
}
