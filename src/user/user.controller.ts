import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({
    description: 'Users has been successfully fetched',
    type: [UserEntity],
  })
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a user "id" that exists in the database',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'User has been successfully fetched',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'User with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User with given "id" does not exist',
  })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Login and password for the new user',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'User has been successfully created.',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a user "id" that exists in the database',
    type: 'string',
  })
  @ApiBody({ type: UpdateUserDto, description: 'A new password for the user' })
  @ApiOkResponse({
    description: 'User has been successfully updated',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'User with given "id" is invalid (not uuid).',
  })
  @ApiNotFoundResponse({
    description: 'User with given "id" does not exist.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a user "id" that exists in the database',
    type: 'string',
  })
  @ApiNoContentResponse({
    description: 'User has been successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'User with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User with given "id" does not exist.',
  })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const isUser = await this.userService.remove(id);

    if (!isUser) {
      throw new NotFoundException('User was not found');
    }
  }
}
