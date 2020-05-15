import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface Todo {
  _id: Types.ObjectId;
  text: string;
  completed: boolean;
}

@Schema()
export class TodoModel extends Document implements Todo {
  @Prop({required: true})
  text: string;

  @Prop({required: true})
  completed: boolean;

  constructor(text: string, completed: boolean) {
    super();
    this.text = text;
    this.completed = completed;
  }
}

export const TodoSchema = SchemaFactory.createForClass(TodoModel);