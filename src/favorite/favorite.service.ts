import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { database } from 'src/database/database';
import { isValidateUUID } from 'src/utils/isValidateUUID';
import { PrismaService } from "../modules/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class FavoriteService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const [albumFavs, artistFavs, trackFavs] = await Promise.all([
      this.prismaService.albumFav.findMany({ include: { album: true } }),
      this.prismaService.artistFav.findMany({ include: { artist: true } }),
      this.prismaService.trackFav.findMany({ include: { track: true } }),
    ]);

    return {
      albums: albumFavs.map((fav) => fav.album),
      artists: artistFavs.map((fav) => fav.artist),
      tracks: trackFavs.map((fav) => fav.track),
    };
  }

  async addTrackToFavorites(trackId: string) {
    isValidateUUID(trackId);

    try {
      await this.prismaService.trackFav.create({ data: { trackId } });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        return false;
      }

      throw err;
    }
  }

  async removeTrack(trackId: string) {
    try {
      await this.prismaService.trackFav.delete({ where: { trackId } });

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

  async addAlbumToFavorites(albumId: string) {
    isValidateUUID(albumId);

    try {
      await this.prismaService.albumFav.create({ data: { albumId } });

      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        return false;
      }

      throw err;
    }
  }

  async removeAlbum(albumId: string) {
    try {
      await this.prismaService.albumFav.delete({ where: { albumId } });

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

  async addArtistToFavorites(artistId: string) {
    isValidateUUID(artistId);

    try {
      await this.prismaService.artistFav.create({ data: { artistId } });

      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        return false;
      }

      throw err;
    }
  }

  async removeArtist(artistId: string) {
    try {
      await this.prismaService.artistFav.delete({ where: { artistId } });

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
