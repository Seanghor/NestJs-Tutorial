import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query, BadRequestException } from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuditoriumService } from '../auditorium/auditorium.service';
import { UpdateSeatStatusDto } from './dto/update-seat.dto';
import { ScreeningService } from '../screening/screening.service';

@Controller('seat')
export class SeatController {
  constructor(
    private readonly seatService: SeatService,
    private readonly auditoriumService: AuditoriumService,
    private readonly screeningService: ScreeningService
  ) { }

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @UseFilters(HttpExceptionFilter)
  @Get()
  async findAll(@Query('auditoriumId') auditoriumId?: string, @Query('screeningId') screeningId?: string) {
    if (auditoriumId) {
      const existingAuditorium = await this.auditoriumService.findOneAuditorium(+auditoriumId)
      if (!existingAuditorium) {
        throw new BadRequestException()
      }
    }
    if (screeningId) {
      const existingScreening = await this.screeningService.findOne(+screeningId)
      if (!existingScreening) {
        throw new BadRequestException()
      }
    }
    const res = await this.seatService.findAll(+auditoriumId, +screeningId)
    return res
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(+id);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() seatDto: UpdateSeatStatusDto) {
    console.log(seatDto.status);

    const res = await this.seatService.updateStatus(+id, seatDto);
    return res
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
