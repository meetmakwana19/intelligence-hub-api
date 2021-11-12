import { Types } from 'mongoose';

import { BadRequestException } from '@nestjs/common';

export const objectIdParser = (value: any) => {
  let parsedValue: Types.ObjectId;
  try {
    parsedValue = new Types.ObjectId(value);
  } catch (error) {
    throw new BadRequestException(`${value} is not a valid ObjectId`);
  }
  return parsedValue;
};
