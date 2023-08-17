import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Artist {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  grammy: boolean;
}
