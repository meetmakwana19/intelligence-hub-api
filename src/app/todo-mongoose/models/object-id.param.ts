import { Types } from 'mongoose';
import { Type, Transform } from 'class-transformer';
import { objectIdParser } from '../parsers/object-id.parser';
import { IsNotEmpty } from 'class-validator';

export class ObjectIdParam {
  @Type(() => Types.ObjectId)
  @Transform(objectIdParser, { toClassOnly: true })
  @IsNotEmpty()
  readonly id: Types.ObjectId;

  constructor(id: Types.ObjectId) {
    this.id = id;
  }
}
