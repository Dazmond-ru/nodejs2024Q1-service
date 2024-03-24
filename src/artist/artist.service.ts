import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { isBoolean, isString } from 'class-validator';
import { isValidateUUID } from 'src/utils/isValidateUUID';
import { PrismaService } from '../modules/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<ArtistEntity[]> {
    const artists = await this.prismaService.artist.findMany();

    return artists.map((artist) => plainToClass(ArtistEntity, artist));
  }

  async findOne(id: string): Promise<ArtistEntity | undefined> {
    isValidateUUID(id);

    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist was not found');
    }

    return plainToClass(ArtistEntity, artist);
  }

  async create({ name, grammy }: CreateArtistDto): Promise<ArtistEntity> {
    if (!name || !isString(name) || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid dto');
    }

    const newArtist = await this.prismaService.artist.create({
      data: { name, grammy },
    });

    return plainToClass(ArtistEntity, newArtist);
  }

  async update(
    id: string,
    { name, grammy }: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    isValidateUUID(id);

    if (!name || !isString(name) || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid dto');
    }

    try {
      const updateArtist = await this.prismaService.artist.update({
        where: { id },
        data: { name, grammy },
      });

      return plainToClass(ArtistEntity, updateArtist);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Artist was not found');
      }

      throw err;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.artist.delete({
        where: { id },
      });

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
