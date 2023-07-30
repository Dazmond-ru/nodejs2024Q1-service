import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { isString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { database } from 'src/database/database';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidateUUID } from 'src/utils/isValidateUUID';

@Injectable()
export class UserService {
  findAll() {
    return database.users;
  }

  findOne(id: string): User | undefined {
    isValidateUUID(id);

    const user = database.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  create({ login, password }: CreateUserDto): User {
    if (!isString(login) || !isString(password)) {
      throw new HttpException(
        'Login and password must be strings',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      id: uuidv4(),
      version: 1,
      login,
      password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    database.users.push(newUser);
    return newUser;
  }

  update(id: string, { newPassword, oldPassword }: UpdateUserDto): User {
    isValidateUUID(id);

    if (!isString(newPassword)) {
      throw new BadRequestException('Invalid dto');
    }

    const user = this.findOne(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    this.findOne(id);

    const userIndex = database.users.findIndex((user) => user.id === id);

    database.users.splice(userIndex, 1);
  }
}
