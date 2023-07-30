import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isString, isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { database } from 'src/database/database';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    database.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return database.albums;
  }

  findOne(id: string): Album {
    if (!this.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    const album = database.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    if (!this.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    if (!name || !year) {
      throw new BadRequestException('Invalid dto');
    }

    if (artistId && !isString(artistId)) {
      throw new BadRequestException('Invalid dto');
    }

    const album = database.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = name;
    album.year = year;

    if (artistId) {
      album.artistId = artistId;
    }

    return album;
  }

  remove(id: string) {
    const album = this.findOne(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const albumIndex = database.albums.findIndex((album) => album.id === id);

    if (album) {
      database.albums.splice(albumIndex, 1);
      database.tracks.forEach((album) => {
        if (album.albumId === id) {
          album.albumId = null;
        }
      });
    }
  }

  isValidAlbumId(id: string): boolean {
    return isUUID(id, 'all');
  }
}
