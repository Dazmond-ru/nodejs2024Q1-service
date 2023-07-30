import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  name: string;
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
