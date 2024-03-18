import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
@ApiTags('Favs')
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @ApiOkResponse({
    description: 'Favorites has been successfully fetched',
  })
  findAll() {
    return this.favoriteService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a track "id" that exists in the database',
    type: 'string',
  })
  @ApiCreatedResponse({
    description: 'Track has been successfully added',
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Track with given "id" does not exist',
  })
  addTrackToFavorites(@Param('id') id: string) {
    return this.favoriteService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a track "id" that exists in the database',
    type: 'string',
  })
  @ApiNoContentResponse({
    description: 'Track has been successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid).',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist.',
  })
  removeTrack(@Param('id', ParseUUIDPipe) trackId: string) {
    return this.favoriteService.removeTrack(trackId);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a album "id" that exists in the database',
    type: 'string',
  })
  @ApiCreatedResponse({
    description: 'Album has been successfully added',
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Album with given "id" does not exist',
  })
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favoriteService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a album "id" that exists in the database',
    type: 'string',
  })
  @ApiNoContentResponse({
    description: 'Album has been successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid).',
  })
  @ApiNotFoundResponse({
    description: 'Album with given "id" does not exist.',
  })
  removeAlbum(@Param('id', ParseUUIDPipe) albumId: string) {
    return this.favoriteService.removeAlbum(albumId);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a artist "id" that exists in the database',
    type: 'string',
  })
  @ApiCreatedResponse({
    description: 'Artist has been successfully added',
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Artist with given "id" does not exist',
  })
  addArtistToFavorites(@Param('id') id: string) {
    return this.favoriteService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a artist "id" that exists in the database',
    type: 'string',
  })
  @ApiNoContentResponse({
    description: 'Artist has been successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid).',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist.',
  })
  removeArtist(@Param('id', ParseUUIDPipe) artistId: string) {
    return this.favoriteService.removeArtist(artistId);
  }
}
