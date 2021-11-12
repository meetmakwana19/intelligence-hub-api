import { Types } from 'mongoose';

import { BadRequestException } from '@nestjs/common';

import { objectIdParser } from './object-id.parser';

describe('Object ID Parser', () => {
  it('parses an object Id', () => {
    const id = objectIdParser('5ec55c5cc0cdd78d69be80cd');
    expect(id).toEqual(new Types.ObjectId('5ec55c5cc0cdd78d69be80cd'));
  });

  it('throws an error when id is invalid', () => {
    expect(() => {
      objectIdParser('5ec55c5cc0cdd78d69be80c');
    }).toThrow(new BadRequestException('5ec55c5cc0cdd78d69be80c is not a valid ObjectId'));
  });
});
