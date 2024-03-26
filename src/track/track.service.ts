import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackEntity } from './entities/track.entity';
import { isString } from 'class-validator';
import { UpdateTrackDto } from './dto/update-track.dto';
import { isValidateUUID } from 'src/utils/isValidateUUID';
import { PrismaService } from '../modules/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<TrackEntity[]> {
    const tracks = await this.prismaService.track.findMany();

    return tracks.map((track) => plainToClass(TrackEntity, track));
  }

  async findOne(id: string): Promise<TrackEntity> {
    isValidateUUID(id);

    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    return plainToClass(TrackEntity, track);
  }

  async create({
    name,
    duration,
    artistId,
    albumId,
  }: CreateTrackDto): Promise<TrackEntity> {
    if (!name || !duration) {
      throw new BadRequestException('Invalid dto');
    }

    try {
      const newTrack = await this.prismaService.track.create({
        data: {
          name,
          duration,
          artist: artistId !== null ? { connect: { id: artistId } } : undefined,
          album: albumId !== null ? { connect: { id: albumId } } : undefined,
        },
      });

      return plainToClass(TrackEntity, newTrack);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025' &&
        typeof err.meta.cause === 'string'
      ) {
        if (err.meta.cause.includes('Album')) {
          throw new Error(
            'Unknown albumId, entity with such id does not exists',
          );
        } else if (err.meta.cause.includes('Artist')) {
          throw new Error(
            'Unknown artistId, entity with such id does not exists',
          );
        }
      }

      throw err;
    }
  }

  async update(
    id: string,
    { name, duration, artistId, albumId }: UpdateTrackDto,
  ): Promise<TrackEntity> {
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

    try {
      const updatedTrack = await this.prismaService.track.update({
        where: { id },
        data: {
          name,
          duration,
          artist: artistId !== null ? { connect: { id: artistId } } : undefined,
          album: albumId !== null ? { connect: { id: albumId } } : undefined,
        },
      });

      return plainToClass(TrackEntity, updatedTrack);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025' &&
        typeof err.meta.cause === 'string'
      ) {
        if (err.meta.cause.includes('Album')) {
          throw new Error(
            'Unknown albumId, entity with such id does not exists',
          );
        } else if (err.meta.cause.includes('Artist')) {
          throw new Error(
            'Unknown artistId, entity with such id does not exists',
          );
        } else {
          return null;
        }
      }

      throw err;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.track.delete({ where: { id } });

      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        return false;
      }

      throw err;
    }
  }
}
