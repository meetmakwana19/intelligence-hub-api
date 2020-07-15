import { Test, TestingModule } from '@nestjs/testing';

import { TodoController } from '../../src/todo/todo.controller';
import { Todo } from '../../src/todo/todo.interface';
import { TodoService } from '../../src/todo/todo.service';
import * as mockData from '../utils/mock.data.json';

const mockDBConnection = {
  collection: jest.fn(),
};

describe('Entry Controller', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        //we are providing mongo connection as null, as our objective is to test only controller level code
        {
          provide: 'TODO__dao_full',
          useValue: mockDBConnection,
        },
      ],
    }).compile();

    //get instance of controller
    controller = module.get<TodoController>(TodoController);
    //get instance of service
    service = module.get<TodoService>(TodoService);
  });
  describe('getEntries', () => {
    const result = <Todo[]>mockData.todo;
    it('should get an array of Entries', () => {
      //Jest will call provided mock implementation instead of 'getAll' method in service
      jest.spyOn(service, 'getAll').mockImplementationOnce(async () => result);
      expect(controller.getAll()).resolves.toEqual(result);
    });
  });
  describe('getById', () => {
    const result = <Todo>mockData.todo[0];
    it('should get a single Entry', () => {
      //Jest will call provided mock implementation instead of 'getOne' method in service
      jest.spyOn(service, 'getByUid').mockImplementationOnce(async () => result);
      expect(controller.getOne(result.uid)).resolves.toEqual(result);
    });
  });
  describe('newEntry', () => {
    it('should create a new Entry', () => {
      const newEntry: Todo = {
        description: 'New Entry 1',
        title: 'New Title',
      };
      const insertOneSpy = jest.spyOn(service, 'insertOne').mockResolvedValueOnce({ uid: 'a uuid', ...newEntry });
      expect(controller.add(newEntry)).resolves.toEqual({
        uid: 'a uuid',
        ...newEntry,
      });
      expect(insertOneSpy).toBeCalledWith(newEntry);
    });
  });
  describe('updateEntry', () => {
    it('should update a new Entry', () => {
      const newEntry: Todo = <Todo>mockData.todo[0];
      jest.spyOn(service, 'updateOne').mockImplementationOnce(async () => newEntry);
      expect(controller.update('blt1', newEntry)).resolves.toEqual(newEntry);
    });
  });
});
