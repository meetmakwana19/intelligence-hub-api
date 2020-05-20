import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './controllers/todo.controller';
import { TodoSchema } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
