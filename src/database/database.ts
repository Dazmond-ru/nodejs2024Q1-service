import { AlbumEntity } from 'src/album/entities/album.entity';
import { ArtistEntity } from 'src/artist/entities/artist.entity';
import { TrackEntity } from 'src/track/entities/track.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export interface Database {
  users: UserEntity[];
  tracks: TrackEntity[];
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  favorites: {
    artists: string[];
    albums: string[];
    tracks: string[];
  };
}

export const database: Database = {
  users: [],
  tracks: [],
  artists: [],
  albums: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
