import * as Joi from '@hapi/joi';

export const configuration = () => ({
  port: process.env.PORT,
  database: {
    URI: process.env.MONGO_DB_URI,
    dbName: process.env.MONGO_DB_NAME,
  }
});

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  MONGO_DB_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
});