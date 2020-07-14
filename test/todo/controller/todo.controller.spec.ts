import { Test, TestingModule } from '@nestjs/testing';

import { TodoController } from '../../../src/todo/todo.controller';
import { Todo } from '../../../src/todo/todo.interface';
import { TodoService } from '../../../src/todo/todo.service';
import * as mockData from '../../utils/mock.data.json';

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
          provide: 'coredb__dao_full',
          useValue: null,
        },
      ],
    }).compile();

    //get instance of controller
    controller = module.get<TodoController>(TodoController);
    //get instance of service
    service = module.get<TodoService>(TodoService);
  });
  describe('getEntries', () => {
    const result = <Todo[]>mockData.todos;
    it('should get an array of Entries', () => {
      //Jest will call provided mock implementation instead of 'getAll' method in service
      jest.spyOn(service, 'getAll').mockImplementationOnce(async () => result);
      expect(controller.getEntries()).resolves.toEqual(result);
    });
  });
  describe('getById', () => {
    const result = <Todo>mockData.todos[0];
    it('should get a single Entry', () => {
      //Jest will call provided mock implementation instead of 'getOne' method in service
      jest.spyOn(service, 'getOne').mockImplementationOnce(async () => result);
      expect(controller.getById(result.uid)).resolves.toEqual(result);
    });
  });
  describe('getByName', () => {
    const result = <Todo>mockData.todos[0];
    it('should get a Entry back', () => {
      jest.spyOn(service, 'getOneBytitle').mockImplementationOnce(async () => result);
      expect(controller.getByTitle(result.title)).resolves.toEqual(result);
      //mockResolvedValue is a simple sugar function for mockImplementation
      const getByNameSpy = jest.spyOn(service, 'getOneBytitle').mockResolvedValueOnce(result);
      expect(controller.getByTitle('Aqua')).resolves.toEqual(result);
      expect(getByNameSpy).toBeCalledWith('Aqua');
    });
  });
  describe('newEntry', () => {
    it('should create a new Entry', () => {
      const newEntry: Todo = {
        description: 'New Entry 1',
        title: 'New Title',
      };
      const insertOneSpy = jest.spyOn(service, 'insertOne').mockResolvedValueOnce({ uid: 'a uuid', ...newEntry });
      expect(controller.newEntry(newEntry)).resolves.toEqual({
        uid: 'a uuid',
        ...newEntry,
      });
      expect(insertOneSpy).toBeCalledWith(newEntry);
    });
  });
  describe('updateEntry', () => {
    it('should update a new Entry', () => {
      const newEntry: Todo = <Todo>mockData.todos[0];
      jest.spyOn(service, 'updateOne').mockImplementationOnce(async () => newEntry);
      expect(controller.updateEntry(newEntry)).resolves.toEqual(newEntry);
    });
  });
  describe('deleteEntry', () => {
    it('should return that it deleted a Entry', () => {
      const resp = {
        deleted: true,
      };
      jest.spyOn(service, 'deleteOne').mockImplementationOnce(async () => resp);
      expect(controller.deleteEntry('a uuid that exists')).resolves.toEqual(resp);
    });
    it('should return that it did not delete a Entry', () => {
      const deleteSpy = jest.spyOn(service, 'deleteOne').mockResolvedValueOnce({ deleted: false });
      expect(controller.deleteEntry('a uuid that does not exist')).resolves.toEqual({ deleted: false });
      expect(deleteSpy).toBeCalledWith('a uuid that does not exist');
    });
  });
});
