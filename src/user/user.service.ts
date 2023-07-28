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
import { isString, isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { database } from 'src/database/database';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  findAll() {
    return database.users;
  }

  findOne(id: string): User | undefined {
    if (!this.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }

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
    if (!this.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }

    if (!isString(newPassword)) {
      throw new BadRequestException('Invalid dto');
    }

    const user = database.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    if (!this.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = this.findOne(id);

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const userIndex = database.users.findIndex((user) => user.id === id);

    database.users.splice(userIndex, 1);
  }

  isValidUserId(id: string): boolean {
    return isUUID(id, 'all');
  }
}
