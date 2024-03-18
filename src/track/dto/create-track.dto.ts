import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
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
