import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

export interface Database {
  users: User[];
  tracks: Track[];
  artists: Artist[];
}

export const database: Database = {
  users: [],
  tracks: [],
  artists: [],
};
