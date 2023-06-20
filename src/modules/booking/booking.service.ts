import { prisma } from './../../../prisma/db';
import { Seat } from './../seat/entities/seat.entity';
import { TicketService } from './../ticket/ticket.service';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBookingAndTicketDto, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ScreeningService } from '../screening/screening.service';
import { MovieService } from '../movie/movie.service';
import { GenerateCustomIDService, } from 'src/utils/jwt';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketService: TicketService,
    private readonly screeningService: ScreeningService,
    private readonly movieService: MovieService,
    private readonly generateCustomeIDService: GenerateCustomIDService,

  ) { }

  async create(createBookingAndTicketDto: CreateBookingAndTicketDto) {
    const screeningInfo = await this.screeningService.findOne(createBookingAndTicketDto.screeningId)
    const movieInfor = await this.movieService.findOneMovie(screeningInfo.movieId)
    // createBookingAndTicketDto.price_for_1 = Math.floor(movieInfor.price);
    // createBookingAndTicketDto.customId = await this.generateCustomeIDService.generateBookingIDAutoIncrement()

    const createBookingDto = {
      customId: await this.generateCustomeIDService.generateBookingIDAutoIncrement(),
      userId: createBookingAndTicketDto.userId,
      screeningId: createBookingAndTicketDto.screeningId,
      num: createBookingAndTicketDto.num,
      price_for_1: Math.floor(movieInfor.price),
      total: createBookingAndTicketDto.num * (Math.floor(movieInfor.price)),
      payStatus: true
    } as CreateBookingDto

    const book = await this.prisma.booking.create({
      data: createBookingDto
    })

    const number_of_tickets = book.num
    for (let i = 0; i < number_of_tickets; i++) {
      // console.log(createBookingDto.tickets);
      const ticket = await this.prisma.ticket.create({
        data: {
          screeningId: book.screeningId,
          customId: await this.generateCustomeIDService.generateTicketCustomId(),
          // seatId: i+1,
          seatId: createBookingAndTicketDto.selectedSeat[i],
          price: Number(book.price_for_1),
          payStatus: true,
          active: true,
          bookingId: book.id,
        },
      })
    }

    await this.prisma.seat.updateMany({
      where: {
        id: {
          in: createBookingAndTicketDto.selectedSeat.map(id => Number(id))
        }
      },
      data: {
        isDisable: true
      }
    })
    const res = await this.prisma.ticket.findMany(
      {
        where: {
          bookingId: book.id
        },
        orderBy: {
          id: 'asc'
        }
      }
    )
    return res



  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
