import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  login: string;

  @ApiProperty()
  @Exclude()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  version: number;

  @ApiProperty()
  @Column('bigint', {
    transformer: {
      to: (value: number) => value.toString(),
      from: (value: string) => parseInt(value, 10),
    },
  })
  createdAt: number;

  @ApiProperty()
  @Column('bigint', {
    transformer: {
      to: (value: number) => value.toString(),
      from: (value: string) => parseInt(value, 10),
    },
  })
  updatedAt: number;
}
