import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../interfaces/user.interface';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
