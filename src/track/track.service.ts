import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { database } from 'src/database/database';
import { isString, isUUID } from 'class-validator';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  findAll() {
    return database.tracks;
  }

  findOne(id: string) {
    if (!this.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = database.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    return track;
  }

  create({ name, duration, artistId, albumId }: CreateTrackDto) {
    if (!name || !duration) {
      throw new BadRequestException('Invalid dto');
    }

    const newTrack: Track = {
      id: uuidv4(),
      name,
      artistId: artistId || null,
      albumId: albumId || null,
      duration,
    };

    database.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, { name, duration, artistId, albumId }: UpdateTrackDto) {
    if (!this.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    if (!name || !duration) {
      throw new BadRequestException('Invalid dto');
    }

    if (artistId && !isString(artistId)) {
      throw new BadRequestException('Invalid dto');
    }

    if (albumId && !isString(albumId)) {
      throw new BadRequestException('Invalid dto');
    }

    const track = database.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    track.name = name || track.name;
    track.duration = duration || track.duration;
    track.artistId = artistId || track.artistId;
    track.albumId = albumId || track.albumId;

    return track;
  }

  remove(id: string) {
    if (!this.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = this.findOne(id);

    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    const trackIndex = database.tracks.findIndex((track) => track.id === id);

    database.favorites.tracks = database.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );

    database.tracks.splice(trackIndex, 1);
  }

  isValidTrackId(id: string): boolean {
    return isUUID(id, 'all');
  }
}
