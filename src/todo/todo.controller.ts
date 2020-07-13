import { Controller, Get, Param, Query, Body, Post, Patch, Delete } from '@nestjs/common';

import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getEntries(): Promise<Todo[]> {
    return this.todoService.getAll();
  }

  @Get('/title')
  async getByTitle(@Query('title') name: string): Promise<Todo> {
    return this.todoService.getOneBytitle(name);
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getOne(id);
  }

  @Post('/new')
  async newEntry(@Body() todo: Todo): Promise<Todo> {
    return this.todoService.insertOne(todo);
  }

  @Patch('/update')
  async updateEntry(@Body() todo: Todo): Promise<Todo> {
    return this.todoService.updateOne(todo);
  }

  @Delete('/delete/:id')
  async deleteEntry(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.todoService.deleteOne(id);
  }

}
