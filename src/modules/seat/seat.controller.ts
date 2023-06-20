import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Query, BadRequestException } from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuditoriumService } from '../auditorium/auditorium.service';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService,
    private readonly auditoriumService: AuditoriumService
  ) { }

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @UseFilters(HttpExceptionFilter)
  @Get()
  async findAll(@Query('auditoriumId') auditoriumId?: string) {
    if (auditoriumId) {
      const existingAuditorium = await this.auditoriumService.findOneAuditorium(+auditoriumId)
      if (!existingAuditorium) {
        throw new BadRequestException()
      }
    }
    const res = await this.seatService.findAll(+auditoriumId)
    return res
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
