import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty({ required: true, description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
