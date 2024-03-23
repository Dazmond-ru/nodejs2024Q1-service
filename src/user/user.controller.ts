import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
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
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
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
  create(@Body() createUserDto: CreateUserDto): UserEntity {
    return plainToClass(UserEntity, this.userService.create(createUserDto));
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return plainToClass(UserEntity, this.userService.update(id, updateUserDto));
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
  remove(@Param('id') id: string) {
    this.userService.remove(id);
  }
}
