import { ScreeningService } from './../screening/screening.service';
import { TicketService } from './../ticket/ticket.service';
import { PrismaService } from './../../prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { IsAuthService } from 'src/middlewares/middlewares.service';
import { MovieService } from '../movie/movie.service';
import { GenerateCustomIDService,  } from 'src/utils/jwt';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, TicketService, ScreeningService, MovieService,GenerateCustomIDService, ]
})
export class BookingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      .forRoutes(BookingController)
  }
}

