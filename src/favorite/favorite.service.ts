import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { database } from 'src/database/database';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  findAll() {
    const tracks = database.favorites.tracks.map((track) =>
      this.trackService.findOne(track),
    );

    const albums = database.favorites.albums.map((album) =>
      this.albumService.findOne(album),
    );

    const artists = database.favorites.artists.map((artist) =>
      this.artistService.findOne(artist),
    );

    return { tracks, albums, artists };
  }

  addTrackToFavorites(trackId: string) {
    if (!isUUID(trackId, 'all')) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = database.tracks.find((track) => track.id === trackId);

    if (track) {
      database.favorites.tracks.push(trackId);
      return track;
    } else {
      throw new UnprocessableEntityException('Track was not found');
    }
  }

  addAlbumToFavorites(albumId: string) {
    if (!isUUID(albumId, 'all')) {
      throw new BadRequestException('Invalid albumId');
    }

    const album = database.albums.find((album) => album.id === albumId);

    if (album) {
      database.favorites.albums.push(albumId);
      return album;
    } else {
      throw new UnprocessableEntityException('Album was not found');
    }
  }

  addArtistToFavorites(artistId: string) {
    if (!isUUID(artistId, 'all')) {
      throw new BadRequestException('Invalid artistId');
    }

    const artist = database.artists.find((artist) => artist.id === artistId);

    if (artist) {
      database.favorites.artists.push(artistId);
      return artist;
    } else {
      throw new UnprocessableEntityException('Artist was not found');
    }
  }

  removeTrack(trackId: string) {
    const trackIndex = database.tracks.findIndex(
      (track) => track.id === trackId,
    );

    if (trackIndex < 0) {
      throw new NotFoundException('Track was not found');
    }

    const favoritesIndex = database.favorites.tracks.indexOf(trackId);

    if (favoritesIndex >= 0) {
      database.favorites.tracks.splice(favoritesIndex, 1);
    }
  }

  removeAlbum(albumId: string) {
    const albumIndex = database.albums.findIndex(
      (album) => album.id === albumId,
    );

    if (albumIndex < 0) {
      throw new NotFoundException('Album was not found');
    }

    const favoritesIndex = database.favorites.albums.indexOf(albumId);
    if (favoritesIndex >= 0) {
      database.favorites.albums.splice(favoritesIndex, 1);
    }
  }

  removeArtist(artistId: string) {
    const artistIndex = database.artists.findIndex(
      (artist) => artist.id === artistId,
    );

    if (artistIndex < 0) {
      throw new NotFoundException('Artist was not found');
    }

    const favoritesIndex = database.favorites.artists.indexOf(artistId);

    if (favoritesIndex >= 0) {
      database.favorites.artists.splice(favoritesIndex, 1);
    }
  }
}
