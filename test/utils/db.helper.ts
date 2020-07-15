import { DAL, DAOService } from '@contentstack/mongodb';
import { getDAOToken } from '@contentstack/mongodb/dist/common/utils';
import { Provider } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import * as mockData from '../resources/mock.data.json';

const COLLECTIONS = ['todos'];

export default class TestDbHelper {
  public readonly server: MongoMemoryServer;
  public db: Db;

  constructor() {
    this.server = new MongoMemoryServer();
  }

  /**
   * Start the server and establish a connection
   */
  async start(): Db {
    const url = await this.server.getConnectionString();
    this.db = await this.getConnection(url);
    await this.addMockData();
    return this.db;
  }

  async getConnection(dbURL: string): Promise<Db> {
    const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
    return client.db();
  }

  async addMockData(): Promise<void> {
    for (const entity in mockData) {
      await this.db.collection(entity).insertMany(mockData[entity]);
    }
  }

  async cleanup(): Promise<void> {
    await Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})));
    this.server.stop();
  }

  public static getProvider(name: string, db: Db, dal: DAL): Provider {
    return {
      provide: getDAOToken(name, dal),
      useFactory: (): DAOService => {
        return new DAOService(db, dal);
      },
    };
  }
}
