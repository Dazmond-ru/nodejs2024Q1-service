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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';
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
import { Track } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly tracksService: TrackService) {}

  @Get()
  @ApiOkResponse({
    description: 'Tracks has been successfully fetched',
    type: [Track],
  })
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a track "id" that exists in the database',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Track has been successfully fetched',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist',
  })
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Name, artistId, albumId and duration for the new track',
    type: CreateTrackDto,
  })
  @ApiCreatedResponse({
    description: 'Track has been successfully created.',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Must be a track "id" that exists in the database',
    type: 'string',
  })
  @ApiBody({
    type: UpdateTrackDto,
    description: 'New name, artistId, albumId and duration for the track',
  })
  @ApiOkResponse({
    description: 'Track has been successfully updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist',
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
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
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.tracksService.remove(id);
  }
}
