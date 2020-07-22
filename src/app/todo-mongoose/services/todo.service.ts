import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { err, ok, Result } from 'neverthrow';

import { TodoNotFound } from '../errors/todo.errors';
import { CreateTodo } from '../models/create-todo.model';
import { Todo, TodoModel } from '../models/todo.model';
import { UpdateTodo } from '../models/update-todo.model';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<TodoModel>) {}

  async createTodo(createTodo: CreateTodo): Promise<Todo> {
    const todo = new this.todoModel({
      ...createTodo,
      completed: false,
    });

    return todo.save();
  }

  async updateTodo(todoId: Types.ObjectId, updateTodo: UpdateTodo): Promise<Result<Todo, TodoNotFound>> {
    const optionalTodo = await this.todoModel.findById(todoId);

    if (!optionalTodo) {
      return err(new TodoNotFound());
    }

    const todo = optionalTodo;
    todo.set(updateTodo);
    const result = await todo.save();

    return ok(result);
  }

  async findAllTodos(): Promise<Todo[]> {
    return this.todoModel.find();
  }
}
