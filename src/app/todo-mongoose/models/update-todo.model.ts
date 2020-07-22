import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodo {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly completed: boolean;

  constructor(text: string, completed: boolean) {
    this.text = text;
    this.completed = completed;
  }
}
