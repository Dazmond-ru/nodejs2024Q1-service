import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ required: true, example: 'New Artist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: false })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
