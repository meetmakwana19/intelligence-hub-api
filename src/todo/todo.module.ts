import { Module } from '@nestjs/common';
import { MongoDBFactory } from '@contentstack/mongodb';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    MongoDBFactory.connect({
      name: 'coredb',
      url: 'mongodb://localhost',
      options: {
        useUnifiedTopology: true,
      },
      database: 'rawcms_production',
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
