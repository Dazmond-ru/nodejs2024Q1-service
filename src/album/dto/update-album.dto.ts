import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty({ required: false, example: 'UpdateAlbum' })
  name: string;

  @ApiProperty({ required: false, example: 2024 })
  year: number;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @IsString()
  @IsOptional()
  artistId: string | null;
}
