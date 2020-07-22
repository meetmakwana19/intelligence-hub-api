import { Types } from 'mongoose';

import { TodoNotFound } from '../errors/todo.errors';
import { CreateTodo } from '../models/create-todo.model';
import { UpdateTodo } from '../models/update-todo.model';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  const todoModel = jest.fn() as any;
  todoModel.findById = jest.fn();
  todoModel.find = jest.fn();
  const todoModelInstance = {
    set: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    todoService = new TodoService(todoModel);
    todoModel.mockClear();
    todoModel.mockImplementation(() => todoModelInstance);
    todoModelInstance.save.mockClear();
    todoModelInstance.save.mockImplementation(() => Promise.resolve(todoModelInstance));
    todoModelInstance.set.mockClear();
  });

  it('creates incomplete todo', async () => {
    const createTodo: CreateTodo = { text: 'buy milk' };

    const result = await todoService.createTodo(createTodo);

    expect(todoModel).toHaveBeenCalledWith({
      text: 'buy milk',
      completed: false,
    });
    expect(todoModelInstance.save).toHaveBeenCalled();
    expect(result).toEqual(todoModelInstance);
  });

  it('updates todo', async () => {
    const todoId = Types.ObjectId();
    const updateTodo: UpdateTodo = { text: 'buy milk', completed: true };
    const findByIdSpy = jest.spyOn(todoModel, 'findById').mockImplementation(() => Promise.resolve(todoModelInstance));

    const result = await todoService.updateTodo(todoId, updateTodo);

    expect(findByIdSpy).toHaveBeenCalledWith(todoId);
    expect(todoModelInstance.set).toHaveBeenCalledWith(updateTodo);
    expect(todoModelInstance.save).toHaveBeenCalled();
    expect((result as any).value).toEqual(todoModelInstance);
  });

  it('throws an error when todo not found', async () => {
    const todoId = Types.ObjectId();
    const updateTodo: UpdateTodo = { text: 'buy milk', completed: true };
    const findByIdSpy = jest.spyOn(todoModel, 'findById').mockImplementation(() => Promise.resolve(undefined));

    const result = await todoService.updateTodo(todoId, updateTodo);

    expect(findByIdSpy).toHaveBeenCalledWith(todoId);
    expect(todoModelInstance.set).not.toHaveBeenCalled();
    expect(todoModelInstance.save).not.toHaveBeenCalled();
    expect((result as any).error).toEqual(new TodoNotFound());
  });

  it('finds all todos', async () => {
    const findSpy = jest.spyOn(todoModel, 'find').mockImplementation(() => Promise.resolve([todoModelInstance]));

    const result = await todoService.findAllTodos();

    expect(findSpy).toHaveBeenCalled();
    expect(result).toEqual([todoModelInstance]);
  });
});
