import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseFilters, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingAndTicketDto, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { ScreeningService } from '../screening/screening.service';
import { MovieService } from '../movie/movie.service';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly screeningService: ScreeningService,
    private readonly movieService: MovieService
  ) { }

  @UseFilters(HttpExceptionFilter)
  @Post()
  async create(@Req() req: Request, @Body() createBookingAndTicketDto: CreateBookingAndTicketDto) {
    const user = req.payload
    createBookingAndTicketDto.userId = +user.userId
    if (!createBookingAndTicketDto.screeningId) throw new BadRequestException('screenId is required')
    if (!createBookingAndTicketDto.num) throw new BadRequestException('num is required')
    return await this.bookingService.create(createBookingAndTicketDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
