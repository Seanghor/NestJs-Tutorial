import { MovieService } from './../movie/movie.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { title } from 'process';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuditoriumService } from '../auditorium/auditorium.service';
import { Request, Response, NextFunction } from 'express';

@Controller('screening')
export class ScreeningController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly movieService: MovieService,
    private readonly auditorium: AuditoriumService,
  ) { }

  @UseFilters(HttpExceptionFilter)
  @Post()
  async create(@Req() req: Request, @Body() createScreeningDto: CreateScreeningDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    if (!createScreeningDto.movieId) throw new BadRequestException('Movie is required')

    const existingMovie = await this.movieService.findOneMovie(createScreeningDto.movieId)
    if (!existingMovie) throw new BadRequestException('MovieId not valid')

    if (!createScreeningDto.auditoriumId) throw new BadRequestException('Auditorium is required')
    const existingAuditorium = await this.auditorium.findOneAuditorium(createScreeningDto.auditoriumId)
    if (!existingAuditorium) throw new BadRequestException('AuditoriumId not valid')

    if (!createScreeningDto.date_show) throw new BadRequestException('date_show is required')
    createScreeningDto.date_show = new Date(createScreeningDto.date_show)

    if (!createScreeningDto.startTime) throw new BadRequestException('startTime is required')
    createScreeningDto.startTime = new Date(
      `1970-01-07T${createScreeningDto.startTime}:00.000Z`
    );
    const duration_min = existingMovie.duration_min
    createScreeningDto.duration_min = duration_min
    const endTime = new Date(createScreeningDto.startTime.getTime() + duration_min * 60000); // 30 minutes = 30 * 60,000 milliseconds
    createScreeningDto.endTime = new Date(endTime.toISOString());

    const res = await this.screeningService.createScreening(createScreeningDto)
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Get()
  async findAll(@Req() req: Request, @Query('movie') movie?: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE', 'USER'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    // if (title) {
    //   const existingTitle = await this.movieService.findMovieByTitle(title)
    //   if (!existingTitle) {
    //     throw new BadRequestException('Invalid title')
    //   }
    // }
    const res = await this.screeningService.findAll(movie)
    if (movie && res.length === 0) {
      throw new BadRequestException()
    }
    return res

  }

  @UseFilters(HttpExceptionFilter)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE', 'USER'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    const res = await this.screeningService.findOne(+id)
    if (!res) {
      throw new BadRequestException()
    }
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateScreeningDto: UpdateScreeningDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE', 'USER'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }

    // check existing Screening:
    const existingScreening = await this.screeningService.findOne(+id)
    if (!existingScreening) throw new BadRequestException()

    // if auditoriumId change
    if (updateScreeningDto.auditoriumId) {
      const existingAuditorium = await this.auditorium.findOneAuditorium(updateScreeningDto.auditoriumId)
      if (!existingAuditorium) throw new BadRequestException('AuditoriumId not valid')
    }

    // if moviedId change:
    if (updateScreeningDto.movieId) {
      const existingMovie = await this.movieService.findOneMovie(updateScreeningDto.movieId)
      if (!existingMovie) throw new BadRequestException('MovieId not valid')
      const duration_min = existingMovie.duration_min  //duration from movieId
      updateScreeningDto.duration_min = duration_min   //duration will update
      // if make change startTime --> get new startTime and new endTime
      if (updateScreeningDto.startTime) {
        const startTime = new Date(`1970-01-07T${updateScreeningDto.startTime}:00.000Z`);  //convert from hh-mm to DateTime in prisma
        const endTime = new Date(startTime.getTime() + duration_min * 60000)
        updateScreeningDto.endTime = new Date(endTime.toISOString());
        console.log(startTime);
        console.log(endTime);
      }
      // If dont make  change startTime --> change only endTime
      const endTime = new Date(existingScreening.startTime.getTime() + duration_min * 60000)
      updateScreeningDto.endTime = new Date(endTime.toISOString());
    }


    // if change startTime, but dont change movieId --> duration_mn not change
    if (updateScreeningDto.startTime) {
      const startTime = new Date(`1970-01-07T${updateScreeningDto.startTime}:00.000Z`);  //convert from hh-mm to DateTime in prisma
      const endTime = new Date(startTime.getTime() + existingScreening.duration_min * 60000)
      updateScreeningDto.startTime = startTime
      updateScreeningDto.endTime = new Date(endTime.toISOString());
    }
    if (updateScreeningDto.date_show) {
      updateScreeningDto.date_show = new Date(updateScreeningDto.date_show)
    }

    const res = await this.screeningService.update(+id, updateScreeningDto);
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE', 'USER'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    const existingScreening = await this.screeningService.findOne(+id)
    if (!existingScreening) throw new BadRequestException()
    return await this.screeningService.remove(+id);
  }
}
