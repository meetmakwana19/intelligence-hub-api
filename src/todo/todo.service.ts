import { Injectable, Inject } from '@nestjs/common';
import { Todo } from './todo.entity';
import { Collection, DAL, DAO, InjectDAO } from '@contentstack/mongodb';
@Injectable()
export class TodoService {
  constructor(@InjectDAO('coredb', DAL.FULL_ACCESS) private clientdb: DAO) {}

  async getAll(): Promise<Todo[]> {
    const todo = this.clientdb.collection('todos');
    return await todo.find<Todo>({});
  }

  async getOne(uid: string): Promise<Todo> {
    const todo = this.clientdb.collection('todos');
    return await todo.findOne<Todo>({ uid });
  }

  async getOneBytitle(title: string): Promise<Todo> {
    const todo = this.clientdb.collection('todos');
    return await todo.findOne<Todo>({ title });
  }

  async insertOne(todo: Todo): Promise<Todo> {
    const entrydb = this.clientdb.collection('todos');
    return await entrydb.insertOne<Todo>(todo);
  }

  async updateOne(todo: Todo): Promise<Todo> {
    const { uid } = todo;
    const entrydb = this.clientdb.collection('todos');
    const newvalues = { $set: { description: todo.description, title: todo.title } };
    await entrydb.updateOne<Todo>({ uid }, newvalues);
    return this.getOne(uid);
  }

  async deleteOne(uid: string): Promise<{ deleted: boolean; message?: string }> {
    const todo = this.clientdb.collection('todos');
    const result = await todo.deleteOne({ uid });
    return { deleted: true };
  }
}
