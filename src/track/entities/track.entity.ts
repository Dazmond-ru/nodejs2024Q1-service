import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Track {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  artistId: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  albumId: string | null;

  @ApiProperty()
  @Column()
  duration: number;
}
