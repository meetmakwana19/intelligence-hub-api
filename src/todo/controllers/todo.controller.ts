import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateTodo } from '../models/create-todo.model';
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
  async update(
    @Body() todo: UpdateTodo,
    @Param('id') id: string
  ): Promise<Todo> {
    let todoId;
    try {
      todoId = Types.ObjectId(id);
    } catch(error) {
      throw new HttpException('Invalid todo ID', HttpStatus.BAD_REQUEST);
    }

    const result = await this.todoService.updateTodo(todoId, todo);
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
