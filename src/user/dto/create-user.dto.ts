import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'login', description: 'User login' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    required: true,
    example: 'password',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
