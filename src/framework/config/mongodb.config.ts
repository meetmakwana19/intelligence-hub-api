import { MongoDBOptions } from '@contentstack/mongodb';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { format } from 'util';

type host = Record<string, unknown>;

const getMongoConnectionURI = (server: host | host[], database: string, username: string, password: string): string => {
  let hosts;
  if (Array.isArray(server)) {
    hosts = server.map(d => format('%s:%d', d.host, d.port)).join(',');
  } else {
    hosts = format('%s:%d', server.host, server.port);
  }

  if (username && password) {
    return format('mongodb://%s:%s@%s/%s', encodeURIComponent(username), encodeURIComponent(password), hosts, database);
  }

  return format('mongodb://%s/%s', hosts, database);
};

export const MongoDBConfig = registerAs(
  'MONGODB',
  // eslint-disable-next-line @typescript-eslint/ban-types
  (): Function => {
    return (name: string): MongoDBOptions => {
      //TODO: validation
      try {
        const database = process.env[name + '_DBNAME'] || null;
        const url =
          process.env[name + '_URL'] ||
          getMongoConnectionURI(JSON.parse(process.env[name + '_HOST']), database, process.env[name + '_USERNAME'], process.env[name + '_PASSWORD']);
        const options = JSON.parse(process.env[name + '_OPTIONS'] || '{"useUnifiedTopology":true}');

        return {
          name,
          url,
          options,
          database,
        };
      } catch (err) {
        Logger.error('Failed to load MongoDB configuration of ' + name + ' database.');
      }
    };
  },
);
