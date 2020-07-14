import { Test, TestingModule } from '@nestjs/testing';
import * as mockData from '../../utils/mock.data.json';
import { TodoService } from '../../../src/todo/todo.service';
import TestDbHelper from '../../utils/db.helper';
import { DAOService, DAL } from '@contentstack/mongodb';

const dbHelper = new TestDbHelper();

describe('TodoService', () => {
  let service: TodoService;
  beforeAll(async () => {
    const db = await dbHelper.start();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: 'coredb__dao_full',
          useFactory: async () => {
            return new DAOService(db, DAL.FULL_ACCESS);
          },
        },
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
      expect(service.getAll()).resolves.toEqual(mockData.todos);
    });
  });
  describe('getOne', () => {
    it('should get a single Todo', () => {
      expect(service.getOne('blt1')).resolves.toEqual(mockData.todos[0]);
    });
  });
  describe('getOneByTitle', () => {
    it('should get one Todo', () => {
      expect(service.getOneBytitle('entry1')).resolves.toEqual(mockData.todos[0]);
    });
  });
  describe('insertOne', () => {
    it('should successfully insert a Entry', async () => {
      const resultData = await service.insertOne({
        description: 'test1',
        uid: '4',
        title: 'title',
      });
      // const insertedRecords=resultData['ops'];
      // expect(insertedRecords.length).toEqual(1);
      expect(resultData.description).toEqual('test1');
      expect(resultData.uid).toEqual('4');
      expect(resultData.title).toEqual('title');
    });
  });
  describe('updateOne', () => {
    it('should call the update method', async () => {
      const resultData = await service.updateOne({
        title: 'updated Title',
        description: 'updated description',
        uid: 'blt1',
      });
      expect(resultData.description).toEqual('updated description');
      expect(resultData.title).toEqual('updated Title');
      expect(resultData.uid).toEqual('blt1');
    });
  });
  describe('deleteOne', () => {
    it('should return {deleted: true}', () => {
      expect(service.deleteOne('blt2')).resolves.toEqual({ deleted: true });
    });
  });
});
