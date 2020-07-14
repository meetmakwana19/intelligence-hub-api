import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { Todo } from './todo.interface';
import { TodoService } from './todo.service';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  async getAll(): Promise<Todo[]> {
    return this.todoService.getAll();
  }

  @Post('/')
  async add(@Body() todo: Todo): Promise<Todo> {
    return this.todoService.insertOne(todo);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getByUid(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() todo: Todo): Promise<Todo> {
    return this.todoService.updateOne(id, todo);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.todoService.deleteOne(id);
  }
}
