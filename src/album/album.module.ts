import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [PrismaModule],
  exports: [AlbumService],
})
export class AlbumModule {}
