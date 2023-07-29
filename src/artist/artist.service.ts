import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { isBoolean, isString, isUUID } from 'class-validator';
import { database } from 'src/database/database';

@Injectable()
export class ArtistService {
  findAll() {
    return database.artists;
  }

  findOne(id: string): Artist | undefined {
    if (!this.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }

    const artist = database.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
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
    if (!this.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }

    if (!name || !isString(name) || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid dto');
    }

    const artist = database.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  remove(id: string) {
    const artist = this.findOne(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const artistIndex = database.artists.findIndex(
      (artist) => artist.id === id,
    );

    database.artists.splice(artistIndex, 1);
    database.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  isValidArtistId(id: string): boolean {
    return isUUID(id, 'all');
  }
}
