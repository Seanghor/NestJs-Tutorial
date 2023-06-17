import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpExceptionFilter, UnauthorizedExceptionFilter } from 'src/model/http-exception.filter';

@Module({
  controllers: [MovieController],
  providers: [MovieService, HttpExceptionFilter, UnauthorizedExceptionFilter, PrismaService],
})
export class MovieModule {}
