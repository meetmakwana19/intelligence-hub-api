import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './controllers/todo.controller';
import { TodoModel, TodoSchema } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TodoModel.name, schema: TodoSchema }])],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
