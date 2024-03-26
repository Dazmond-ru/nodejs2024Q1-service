import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @ApiProperty({ required: true, example: 'Update Artist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
