import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOkResponse({
    description: 'Albums has been successfully fetched',
    type: [Album],
  })
  findAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a album "id" that exists in the database',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Album has been successfully fetched',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album with given "id" does not exist',
  })
  findOne(@Param('id') id: string): Album {
    return this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateAlbumDto,
    description: 'Name, year and artistId for the new album',
  })
  @ApiCreatedResponse({
    description: 'The album has been successfully created.',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a album "id" that exists in the database',
    type: 'string',
  })
  @ApiBody({
    type: UpdateAlbumDto,
    description: 'New name, year or artistId for the album',
  })
  @ApiOkResponse({
    description: 'Album has been successfully updated',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album with given "id" does not exist' })
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
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
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album with given "id" does not exist' })
  remove(@Param('id') id: string) {
    this.albumService.remove(id);
  }
}
