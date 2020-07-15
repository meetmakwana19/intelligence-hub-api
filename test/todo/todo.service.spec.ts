import { DAL } from '@contentstack/mongodb';
import { Test, TestingModule } from '@nestjs/testing';

import { TodoService } from '../../src/todo/todo.service';
import { APP_DB } from '../../src/utils';
import TestDbHelper from '../utils/db.helper';
import * as mockData from '../utils/mock.data.json';

const dbHelper = new TestDbHelper();

describe('TodoService', () => {
  let service: TodoService;
  beforeAll(async () => {
    const db = await dbHelper.start();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        TestDbHelper.getProvider(APP_DB, db, DAL.FULL_ACCESS),
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });
  afterAll(async () => {
    //Stop MongoMemoryServer and clear memory
    await dbHelper.cleanup();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of todos', () => {
      expect(service.getAll()).resolves.toEqual(mockData.todo);
    });
  });

  describe('getOne', () => {
    it('should get a single Todo', () => {
      expect(service.getByUid('blt1')).resolves.toEqual(mockData.todo[0]);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a Entry', async () => {
      const resultData = await service.insertOne({
        description: 'test1',
        uid: '4',
        title: 'title',
      });

      expect(resultData.description).toEqual('test1');
      expect(resultData.uid).toEqual('4');
      expect(resultData.title).toEqual('title');
    });
  });

  describe('updateOne', () => {
    it('should call the update method', async () => {
      const resultData = await service.updateOne('blt1', {
        title: 'updated Title',
        description: 'updated description',
        uid: 'blt1',
      });
      expect(resultData.uid).toEqual('blt1');
    });
  });
});
