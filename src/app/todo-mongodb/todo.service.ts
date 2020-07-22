import { Collection, DAL, DAO, InjectDAO } from '@contentstack/mongodb';
import { Injectable } from '@nestjs/common';

import { APP_DB } from '../../framework/utils';
import { Todo } from './todo.interface';

@Injectable()
export class TodoService {
  private readonly todo: Collection;

  constructor(@InjectDAO(APP_DB, DAL.FULL_ACCESS) private db: DAO) {
    this.todo = db.collection('todo');
  }

  async getAll(): Promise<Todo[]> {
    return await this.todo.find<Todo>({});
  }

  async getByUid(uid: string): Promise<Todo> {
    return await this.todo.findOne<Todo>({ uid });
  }

  async insertOne(todo: Todo): Promise<Todo> {
    return await this.todo.insertOne<Todo>(todo);
  }

  async updateOne(uid: string, todo: Todo): Promise<Todo> {
    return await this.todo.updateOne<Todo>({ uid }, { $set: todo });
  }

  async deleteOne(uid: string): Promise<boolean> {
    await this.todo.deleteOne<Todo>({ uid });
    return true;
  }
}
