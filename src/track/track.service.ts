import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { database } from 'src/database/database';
import { isString } from 'class-validator';
import { UpdateTrackDto } from './dto/update-track.dto';
import { isValidateUUID } from 'src/utils/isValidateUUID';

@Injectable()
export class TrackService {
  findAll() {
    return database.tracks;
  }

  findOne(id: string) {
    isValidateUUID(id);

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
    isValidateUUID(id);

    if (!name || !duration) {
      throw new BadRequestException('Invalid dto');
    }

    if (artistId && !isString(artistId)) {
      throw new BadRequestException('Invalid dto');
    }

    if (albumId && !isString(albumId)) {
      throw new BadRequestException('Invalid dto');
    }

    const track = this.findOne(id);
    track.name = name;
    track.duration = duration;
    track.artistId = artistId;
    track.albumId = albumId;

    return track;
  }

  remove(id: string) {
    this.findOne(id);

    const trackIndex = database.tracks.findIndex((track) => track.id === id);

    database.tracks.splice(trackIndex, 1);

    database.favorites.tracks = database.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }
}
