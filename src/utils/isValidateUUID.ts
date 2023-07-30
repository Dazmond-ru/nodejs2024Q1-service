import { BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export const isValidateUUID = (id: string): void => {
  if (!isUUID(id, 'all')) {
    throw new BadRequestException('Invalid userId');
  }
};
