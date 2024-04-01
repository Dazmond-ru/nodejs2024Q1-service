import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ required: true, example: 'New Track' })
  name: string;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  artistId: string | null;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  albumId: string | null;

  @ApiProperty({ description: 'Duration in seconds', example: 392 })
  duration: number;
}
