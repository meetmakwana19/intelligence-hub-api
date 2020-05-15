import { IsString, IsNotEmpty } from "class-validator";

export class CreateTodo {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }
}