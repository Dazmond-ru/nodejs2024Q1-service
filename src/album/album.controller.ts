import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
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
    type: [AlbumEntity],
  })
  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumService.findAll();
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
    type: AlbumEntity,
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album with given "id" does not exist',
  })
  async findOne(@Param('id') id: string): Promise<AlbumEntity> {
    return await this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateAlbumDto,
    description: 'Name, year and artistId for the new album',
  })
  @ApiCreatedResponse({
    description: 'The album has been successfully created.',
    type: AlbumEntity,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return await this.albumService.create(createAlbumDto);
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
    type: AlbumEntity,
  })
  @ApiBadRequestResponse({
    description: 'Album with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album with given "id" does not exist' })
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return await this.albumService.update(id, updateAlbumDto);
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
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const isAlbum = await this.albumService.remove(id);

    if (!isAlbum) {
      throw new NotFoundException('Album was not found');
    }
  }
}
