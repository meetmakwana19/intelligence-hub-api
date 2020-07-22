import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as path from 'path';

import { MongoDBConfig } from './mongodb.config';
import { mongooseConfig, validationSchema } from './mongoose.config';

export function loadConfig(): ConfigModuleOptions {
  return {
    envFilePath: path.join(__dirname, '../../..', (process.env.NODE_ENV || 'development') + '.env'),
    load: [MongoDBConfig, mongooseConfig],
    validationSchema,
    expandVariables: true,
  };
}
