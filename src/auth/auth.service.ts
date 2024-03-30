import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { UserEntity } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Token, TokenData } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup({ login, password }: CreateUserDto): Promise<UserEntity> {
    if (!login || !password) {
      throw new Error('Login and password are required');
    }
    return await this.usersService.create({ login, password });
  }

  async login({ login, password }: CreateUserDto) {
    const user = await this.usersService.findOneByLogin(login);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid auth data');
    }
    const payload: Token = {
      userId: user.id,
      login: user.login,
    };

    const accessTokenData: TokenData = {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    };

    const refreshTokenData: TokenData = {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    };

    return {
      accessToken: this.jwtService.sign(payload, accessTokenData),
      refreshToken: this.jwtService.sign(payload, refreshTokenData)
    };
  }

  async refresh(authRefreshDto: AuthRefreshDto) {
    try {
      const { userId } = this.jwtService.verify(authRefreshDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const user = await this.usersService.findOne(userId);

      const payload: Token = {
        userId: user.id,
        login: user.login,
      };

      const accessTokenData: TokenData = {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      };

      const refreshTokenData: TokenData = {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      };
      return {
        accessToken: this.jwtService.sign(payload, accessTokenData),
        refreshToken: this.jwtService.sign(
          payload,
          refreshTokenData,
        )
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Refresh token expired');
      }
    }
  }
}
