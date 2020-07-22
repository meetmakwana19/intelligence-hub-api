import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';

import { CreateTodo } from '../models/create-todo.model';
import { ObjectIdParam } from '../models/object-id.param';
import { Todo } from '../models/todo.model';
import { UpdateTodo } from '../models/update-todo.model';
import { TodoService } from '../services/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(@Body() todo: CreateTodo): Promise<Todo> {
    return this.todoService.createTodo(todo);
  }

  @Put(':id')
  async update(@Body() todo: UpdateTodo, @Param() params: ObjectIdParam): Promise<Todo> {
    const result = await this.todoService.updateTodo(params.id, todo);

    if (result.isOk()) {
      return result.value;
    } else {
      throw new NotFoundException('todo not found');
    }
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAllTodos();
  }
}
