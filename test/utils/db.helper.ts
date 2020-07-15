import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import * as mockData from './mock.data.json';

const COLLECTIONS = ['todos'];
export default class TestDbHelper {
  public server = new MongoMemoryServer();
  public db: Db;
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
    return new Promise((resolve, reject) => {
      MongoClient.connect(dbURL, { useNewUrlParser: true }, async (error, client) => {
        const db = await client.db();
        resolve(db);
      });
    });
  }

  async addMockData(): Promise<void> {
    for (const entity in mockData) {
      await this.db.collection(entity).insertMany(mockData[entity]);
    }
  }

  async cleanup(): Promise<void> {
    await Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})));
    // await this.db.getCollectionNames().forEach(
    //   (collection_name) =>{
    //     this.db[collection_name].remove()
    //   }
    // );
    this.server.stop();
  }
}
