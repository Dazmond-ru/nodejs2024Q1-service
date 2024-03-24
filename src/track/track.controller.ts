import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { TrackEntity } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOkResponse({
    description: 'Tracks has been successfully fetched',
    type: [TrackEntity],
  })
  async findAll(): Promise<TrackEntity[]> {
    return await this.trackService.findAll();
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
    type: TrackEntity,
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist',
  })
  async findOne(@Param('id') id: string): Promise<TrackEntity> {
    return await this.trackService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Name, artistId, albumId and duration for the new track',
    type: CreateTrackDto,
  })
  @ApiCreatedResponse({
    description: 'Track has been successfully created.',
    type: TrackEntity,
  })
  @ApiBadRequestResponse({
    description: 'Request does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    return await this.trackService.create(createTrackDto);
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
    type: TrackEntity,
  })
  @ApiBadRequestResponse({
    description: 'Track with given "id" is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track with given "id" does not exist',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
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
  async remove(@Param('id') id: string) {
    const isTrack = await this.trackService.remove(id);

    if (!isTrack) {
      throw new NotFoundException('Track was not found');
    }
  }
}
