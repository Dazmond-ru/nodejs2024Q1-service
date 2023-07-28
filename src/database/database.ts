import { User } from 'src/user/entities/user.entity';

export interface Database {
  users: User[];
}

export const database: Database = {
  users: [],
};
