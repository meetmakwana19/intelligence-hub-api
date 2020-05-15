import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { err, ok } from 'neverthrow';
import * as request from 'supertest';
import { validationPipe } from '../../app/validation-pipe';
import { TodoNotFound } from '../errors/todo.errors';
import { CreateTodo } from '../models/create-todo.model';
import { UpdateTodo } from '../models/update-todo.model';
import { TodoService } from '../services/todo.service';
import { TodoController } from './todo.controller';

describe('Todo Controller', () => {
  let app: INestApplication;
  let todoService: TodoService;
  const expectedTodo = {_id: Types.ObjectId(), text: 'buy milk', completed: false};

  function toJSON(document: any) {
    return JSON.parse(JSON.stringify(document));
  }

  beforeEach(async () => {
    todoService = new TodoService({} as any);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService]
    })
    .overrideProvider(TodoService)
    .useValue(todoService)
    .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(validationPipe);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('todo creation', () => {
    it('creates a todo', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'createTodo').mockImplementation(() => Promise.resolve(expectedTodo));
      const todo: CreateTodo = {text: 'Buy milk'};
  
      return request(app.getHttpServer())
        .post('/todos')
        .send(todo)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(toJSON(expectedTodo))
        .then(() => {
          expect(todoServiceSpy).toHaveBeenCalledWith(todo);
        });
    });
  
    it('does not create an empty todo', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'createTodo').mockImplementation(() => Promise.resolve(expectedTodo));
      const todo: CreateTodo = {text: ''};
  
      return request(app.getHttpServer())
        .post('/todos')
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });
  
    it('does not allow extra parameters in request', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'createTodo').mockImplementation(() => Promise.resolve(expectedTodo));
      const todo = {text: 'buy milk', completed: true};
  
      return request(app.getHttpServer())
        .post('/todos')
        .send(todo)
        .expect(201)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).toHaveBeenCalledWith({text: 'buy milk'});
        });
    });
  
    it('does not allow datatype other than string for todo text', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'createTodo').mockImplementation(() => Promise.resolve(expectedTodo));
      const todo = {text: 42};
  
      return request(app.getHttpServer())
        .post('/todos')
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });  
  });

  describe('todo updation', () => {
    it('updates a todo', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo: UpdateTodo = {text: 'Buy milk', completed: true};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(toJSON(expectedTodo))
        .then(() => {
          expect(todoServiceSpy).toHaveBeenCalledWith(expectedTodo._id, todo);
        });
    });

    it('does not update with empty todo text', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo: UpdateTodo = {text: '', completed: true};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });

    it('does not update without completed status', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo = {text: 'buy milk'};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });

    it('does not allow datatype other than string for todo text', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo = {text: 42, completed: true};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });

    it('does not allow datatype other than boolean for todo completed status', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo = {text: 'buy milk', completed: 'true'};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });

    it('does not allow invalid id', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(ok(expectedTodo)));
      const todo = {text: 'buy milk', completed: true};

      return request(app.getHttpServer())
        .put('/todos/1')
        .send(todo)
        .expect(400)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).not.toHaveBeenCalled();
        });
    });

    it('returns error when todo not found', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'updateTodo').mockImplementation(() => Promise.resolve(err(new TodoNotFound())));
      const todo = {text: 'buy milk', completed: true};

      return request(app.getHttpServer())
        .put(`/todos/${expectedTodo._id}`)
        .send(todo)
        .expect(404)
        .expect('Content-Type', /json/)
        .then(() => {
          expect(todoServiceSpy).toHaveBeenCalledWith(expectedTodo._id, todo);
        });
    });
  });

  describe('find all todos', () => {
    it('finds all todos', () => {
      const todoServiceSpy = jest.spyOn(todoService, 'findAllTodos').mockImplementation(() => Promise.resolve([expectedTodo]));

      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(toJSON([expectedTodo]))
        .then(() => {
          expect(todoServiceSpy).toHaveBeenCalled();
        });
    });
  });
});
