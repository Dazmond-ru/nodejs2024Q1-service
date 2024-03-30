import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode, ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { Public } from './decorators/decorator';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @ApiOperation({
    summary: 'Signup',
    description: 'Signup a user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body does not contain required fields',
  })
  async signup(@Body() signupUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.authService.signup(signupUserDto);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Login',
    description: 'Logins a user and returns access & refresh tokens',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login with provided login and password' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'DTO is invalid (no login or password, or they are not a strings)',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Incorrect login or password',
  })
  async login(@Body() loginUserDto: CreateUserDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        loginUserDto,
      );
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ForbiddenException('Incorrect login or password');
    }
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refreshes user\'s tokens',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful refresh.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'DTO is invalid (no refreshToken in body)',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Authentication failed (refresh token in the body is invalid or expired)',
  })
  async refresh(@Body() refreshAuthDto: AuthRefreshDto) {
    return await this.authService.refresh(refreshAuthDto);
  }
}
