import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { isBoolean, isString } from 'class-validator';
import { database } from 'src/database/database';
import { isValidateUUID } from 'src/utils/isValidateUUID';

@Injectable()
export class ArtistService {
  findAll() {
    return database.artists;
  }

  findOne(id: string): Artist | undefined {
    isValidateUUID(id);

    const artist = database.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist was not found');
    }

    return artist;
  }

  create({ name, grammy }: CreateArtistDto) {
    if (!name || !isString(name) || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid dto');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    database.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, { name, grammy }: UpdateArtistDto): Artist {
    isValidateUUID(id);

    if (!name || !isString(name) || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid dto');
    }

    const artist = this.findOne(id);
    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  remove(id: string) {
    this.findOne(id);

    const artistIndex = database.artists.findIndex(
      (artist) => artist.id === id,
    );

    database.artists.splice(artistIndex, 1);

    database.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    database.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    database.favorites.artists = database.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
