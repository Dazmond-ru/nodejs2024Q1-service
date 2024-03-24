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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { UpdateArtistDto } from './dto/update-artist.dto';
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

@ApiTags('Artists')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOkResponse({
    description: 'Artists has been successfully fetched',
    type: [ArtistEntity],
  })
  async findAll(): Promise<ArtistEntity[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a artist "id" that exists in the database',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Artist has been successfully fetched',
    type: ArtistEntity,
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ArtistEntity> {
    return await this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateArtistDto,
    description: 'Name and grammy for the new artist',
  })
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: ArtistEntity,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  async create(
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<ArtistEntity> {
    return await this.artistService.create(createArtistDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a artist "id" that exists in the database',
    type: 'string',
  })
  @ApiBody({
    type: UpdateArtistDto,
    description: 'New name and grammy for the artist',
  })
  @ApiOkResponse({
    description: 'Artist has been successfully updated',
    type: ArtistEntity,
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
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
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const isArtist = await this.artistService.remove(id);

    if (!isArtist) {
      throw new NotFoundException('Artist was not found');
    }
  }
}
