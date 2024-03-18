import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  year: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  artistId: string | null;
}
