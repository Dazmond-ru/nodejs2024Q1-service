import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @ApiProperty({ required: true, example: 'Update Track' })
  name: string;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  artistId: string | null;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  albumId: string | null;

  @ApiProperty({ description: 'Duration in seconds', example: 392 })
  duration: number;
}
