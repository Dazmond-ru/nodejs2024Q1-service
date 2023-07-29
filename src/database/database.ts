import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

export interface Database {
  users: User[];
  tracks: Track[];
}

export const database: Database = {
  users: [],
  tracks: [],
};
