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
import * as bcrypt from 'bcrypt';

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

    try {
      const cryptSalt = parseInt(process.env.CRYPT_SALT) || 10
      const passwordHash = await bcrypt.hash(password, cryptSalt);

      const newUser = await this.prismaService.user.create({
        data: { login, password: passwordHash },
      });

      return plainToClass(UserEntity, newUser);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new Error(
          `User ${login} already exists`,
        );
      }
      throw err;
    }
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

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException('Password is wrong');
    }

    const cryptSalt = parseInt(process.env.CRYPT_SALT) || 10
    const hashPassword = await bcrypt.hash(newPassword, cryptSalt);

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: { version: user.version + 1, password: hashPassword },
      });

      return plainToClass(UserEntity, updatedUser);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('User was not found');
      }

      throw err;
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

  async getUserByLogin(login: string) {
    const user = await this.prismaService.user.findUnique({ where: { login } });
    return user;
  }
}
