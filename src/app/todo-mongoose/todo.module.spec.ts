import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

import { TodoModuleMoongoose } from './todo.module';

describe('Todo integration test', () => {
  let app: INestApplication;
  const mongod = new MongoMemoryServer();
  const fastify = new FastifyAdapter({});

  beforeAll(async () => {
    const mongooseModule = MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = await mongod.getUri();
        return {
          uri: uri,
        };
      },
    });
    const moduleRef = await Test.createTestingModule({
      imports: [TodoModuleMoongoose, mongooseModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(fastify);
    await app.init();
    await app
      .getHttpAdapter()
      .getInstance()
      .ready();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('creates and finds todos', async () => {
    const httpServer = app.getHttpServer();
    const createResponse = await request(httpServer)
      .post('/todos')
      .send({
        text: 'buy milk',
      })
      .expect(201);

    const findResponse = await request(httpServer)
      .get('/todos')
      .expect(200);

    expect(findResponse.body.length).toBe(1);
    expect(findResponse.body[0]._id).toBe(createResponse.body._id);
    expect(findResponse.body[0].text).toBe('buy milk');
  });
});
