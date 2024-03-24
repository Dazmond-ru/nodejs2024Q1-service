import { AlbumEntity } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export interface Database {
  users: UserEntity[];
  tracks: Track[];
  artists: Artist[];
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
