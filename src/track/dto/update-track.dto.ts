import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  artistId: string | null;

  @ApiProperty({
    required: false,
  })
  albumId: string | null;

  @ApiProperty()
  duration: number;
}
