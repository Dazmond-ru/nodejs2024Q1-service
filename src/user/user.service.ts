import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { isString } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidateUUID } from 'src/utils/isValidateUUID';
import { PrismaService } from '../modules/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany();

    return users.map((user) => plainToClass(UserEntity, user));
  }

  async findOne(id: string): Promise<UserEntity | undefined> {
    isValidateUUID(id);

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return plainToClass(UserEntity, user);
  }

  async create({ login, password }: CreateUserDto): Promise<UserEntity> {
    if (!isString(login) || !isString(password)) {
      throw new HttpException(
        'Login and password must be strings',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.prismaService.user.create({
      data: { login, password },
    });

    return plainToClass(UserEntity, newUser);
  }

  async update(
    id: string,
    { newPassword, oldPassword }: UpdateUserDto,
  ): Promise<UserEntity> {
    isValidateUUID(id);

    if (!isString(newPassword)) {
      throw new BadRequestException('Invalid dto');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: { version: user.version + 1, password: newPassword },
      });

      return plainToClass(UserEntity, updatedUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User was not found');
      }

      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return false;
      }

      throw error;
    }
  }
}
