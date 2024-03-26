import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { isValidateUUID } from 'src/utils/isValidateUUID';
import { PrismaService } from '../modules/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<AlbumEntity[]> {
    const albums = await this.prismaService.album.findMany();

    return albums.map((album) => plainToClass(AlbumEntity, album));
  }

  async findOne(id: string): Promise<AlbumEntity> {
    isValidateUUID(id);

    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album was not found');
    }

    return plainToClass(AlbumEntity, album);
  }

  async create({ name, year, artistId }: CreateAlbumDto): Promise<AlbumEntity> {
    if (!name || !year) {
      throw new BadRequestException('Invalid dto');
    }

    try {
      const newAlbum = await this.prismaService.album.create({
        data: { name, year, artistId: artistId || null },
      });

      return plainToClass(AlbumEntity, newAlbum);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new Error(
          'Unknown artistId, entity with such id does not exists',
        );
      }

      throw err;
    }
  }

  async update(id: string, { name, year, artistId }: UpdateAlbumDto) {
    isValidateUUID(id);

    if (!name || !year) {
      throw new BadRequestException('Invalid dto');
    }

    if (artistId && !isString(artistId)) {
      throw new BadRequestException('Invalid dto');
    }

    try {
      const updatedAlbum = await this.prismaService.album.update({
        where: { id },
        data: { name, year, artistId },
      });

      return plainToClass(AlbumEntity, updatedAlbum);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Album was not found');
        } else if (err.code === 'P2003') {
          throw new Error(
            'Unknown artistId, entity with such id does not exists',
          );
        }
      }

      throw err;
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.album.delete({
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
