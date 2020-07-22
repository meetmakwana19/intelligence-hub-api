import * as Joi from '@hapi/joi';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig = (): MongooseModuleOptions => ({
  port: process.env.PORT,
  database: {
    URI: process.env.MONGO_DB_URI,
    dbName: process.env.MONGO_DB_NAME,
  },
});

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  MONGO_DB_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
});
