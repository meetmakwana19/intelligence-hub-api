import { DAL, DAOService } from '@contentstack/mongodb';
import { getDAOToken } from '@contentstack/mongodb/dist/common/utils';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import { APP_DB } from '../../../src/framework/utils';
import TestDbHelper from '../../framework/utils/db.helper';

const dbHelper = new TestDbHelper();

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  beforeAll(
    async () =>
      new Promise(async resolve => {
        const db = await dbHelper.start();
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        })
          .overrideProvider(getDAOToken(APP_DB, DAL.FULL_ACCESS))
          .useValue(new DAOService(db, DAL.FULL_ACCESS))
          .compile();

        app = await moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await app
          .getHttpAdapter()
          .getInstance()
          .ready();
        resolve();
      }),
  );

  afterAll(
    async () =>
      new Promise(async resolve => {
        dbHelper.cleanup().then(() => {
          resolve();
        });
      }),
  );

  it('/todo (GET) - Verify entry data', async done => {
    const response = await request(app.getHttpServer()).get('/todo');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    done();
  });

  it('/todo/:id (GET) - Verify data with id', async done => {
    const response = await request(app.getHttpServer()).get('/todo/blt1');
    expect(response.status).toBe(200);
    expect(response.body.uid).toEqual('blt1');
    done();
  });

  it('/todo (POST) - Verify data with id', async done => {
    const response = await request(app.getHttpServer())
      .post('/todo')
      .send({
        uid: 'new1',
        description: 'name1',
        title: 'title1',
      });
    expect(response.status).toBe(201);
    expect(response.body.description).toEqual('name1');
    expect(response.body.uid).toEqual('new1');
    expect(response.body.title).toEqual('title1');

    done();
  });

  it('/todo/:id (DELETE) - Verify data with id', async done => {
    const response = await request(app.getHttpServer()).delete('/todo/blt1');
    expect(response.status).toBe(200);
    done();
  });
});
