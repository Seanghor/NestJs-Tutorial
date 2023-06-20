import { PrismaService } from './../../prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule, UnauthorizedException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpExceptionFilter, UnauthorizedExceptionFilter } from 'src/model/http-exception.filter';
import { IsAuthService } from 'src/middlewares/middlewares.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, HttpExceptionFilter , UnauthorizedExceptionFilter, PrismaService, IsAuthService],
})
export class MovieModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      .forRoutes(MovieController)
  }
}
