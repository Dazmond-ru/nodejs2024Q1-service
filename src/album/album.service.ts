import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { database } from 'src/database/database';
import { isValidateUUID } from 'src/utils/isValidateUUID';

@Injectable()
export class AlbumService {
  findAll() {
    return database.albums;
  }

  findOne(id: string): Album {
    isValidateUUID(id);

    const album = database.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album was not found');
    }

    return album;
  }

  create({ name, year, artistId }: CreateAlbumDto) {
    if (!name || !year) {
      throw new BadRequestException('Invalid dto');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artistId || null,
    };

    database.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    isValidateUUID(id);

    if (!name || !year) {
      throw new BadRequestException('Invalid dto');
    }

    if (artistId && !isString(artistId)) {
      throw new BadRequestException('Invalid dto');
    }

    const album = this.findOne(id);
    album.name = name;
    album.year = year;

    if (artistId) {
      album.artistId = artistId;
    }

    return album;
  }

  remove(id: string) {
    this.findOne(id);

    const albumIndex = database.albums.findIndex((album) => album.id === id);

    database.albums.splice(albumIndex, 1);

    database.tracks.forEach((album) => {
      if (album.albumId === id) {
        album.albumId = null;
      }
    });

    database.favorites.albums = database.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }
}
