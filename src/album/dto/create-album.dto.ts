import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ required: true, example: 'NewAlbum' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 2024 })
  @IsInt()
  year: number;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  artistId: string | null;
}
