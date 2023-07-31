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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
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
    type: [Artist],
  })
  findAll() {
    return this.artistService.findAll();
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
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist',
  })
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateArtistDto,
    description: 'Name and grammy for the new artist',
  })
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    const newArtist = this.artistService.create(createArtistDto);
    return newArtist;
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
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Artist with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist with given "id" does not exist',
  })
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    return this.artistService.update(id, updateArtistDto);
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
  remove(@Param('id') id: string) {
    this.artistService.remove(id);
  }
}
