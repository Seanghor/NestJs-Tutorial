
import { TicketService } from './../ticket/ticket.service';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBookingAndTicketDto, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ScreeningService } from '../screening/screening.service';
import { MovieService } from '../movie/movie.service';
import { GenerateCustomIDService, } from 'src/utils/jwt';
import { SeatStatusEnum } from '@prisma/client';

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

    const number_of_tickets = createBookingDto.num
    for (let i = 0; i < number_of_tickets; i++) {
      // console.log(createBookingDto.tickets);
      const ticket = await this.prisma.ticket.create({
        data: {
          screeningId: book.screeningId,
          customId: await this.generateCustomeIDService.generateTicketCustomId(),
          seatId: createBookingAndTicketDto.selectedSeat[i],
          price: Number(book.price_for_1),
          payStatus: true,
          active: true,
          bookingId: book.id,
        },
      })
    }

    // update status of seat after book:
    await this.prisma.seat.updateMany({
      where: {
        id: {
          in: createBookingAndTicketDto.selectedSeat.map(id => Number(id))
        }
      },
      data: {
        status: SeatStatusEnum.OWNED
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

    // verify screening is available:
    const getCurrentTicket = await this.prisma.screening.findUnique({
      where: {
        id: book.screeningId
      },
      select: {
        _count: {
          select: {
            Ticket: true
          },
        },
      },
    })
    const numOfCurrentTicket = getCurrentTicket._count.Ticket
    const auditorium = await this.prisma.auditorium.findUnique({
      where: {
        id: screeningInfo.auditoriumId
      }
    })
    console.log("current booking:", `${numOfCurrentTicket}/${auditorium.num_seats}`);

    // validate screen if seat is full:
    if (numOfCurrentTicket === auditorium.num_seats) {
      await this.prisma.screening.update({
        where: {
          id: createBookingAndTicketDto.screeningId
        },
        data: {
          isAvailable: false
        }
      })
    }
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
