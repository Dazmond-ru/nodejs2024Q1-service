import { ApiProperty } from '@nestjs/swagger';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class Favorite {
  @ApiProperty()
  artists: Artist[];

  @ApiProperty()
  albums: AlbumEntity[];

  @ApiProperty()
  tracks: Track[];
}
