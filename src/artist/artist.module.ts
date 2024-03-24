import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [PrismaModule],
  exports: [ArtistService],
})
export class ArtistModule {}
