import { ApiProperty } from '@nestjs/swagger';
import { AlbumEntity } from 'src/album/entities/album.entity';
import { ArtistEntity } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class Favorite {
  @ApiProperty()
  artists: ArtistEntity[];

  @ApiProperty()
  albums: AlbumEntity[];

  @ApiProperty()
  tracks: Track[];
}
