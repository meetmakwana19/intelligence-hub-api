import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import TestDbHelper from '../utils/db.helper';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { DAOService, DAL } from '@contentstack/mongodb';

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
          .overrideProvider('TODO__dao_full')
          .useValue(new DAOService(db, DAL.FULL_ACCESS))
          .compile();

        app = await moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
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
