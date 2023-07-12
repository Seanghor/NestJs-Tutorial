import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, BadRequestException, UseFilters, ClassSerializerInterceptor, UseInterceptors, Query, Req, UnauthorizedException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { MovieEntity, } from './entities/movie.entity';
import { MovieStatusEnum } from '@prisma/client';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from 'src/utils/upload-service';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  // @UseFilters(UnauthorizedException)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createMovie(@Req() req: Request, @Body() createMovieDto: CreateMovieDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    if (!createMovieDto.title) return new BadRequestException('Title is required')
    const exisitngTitle = await this.movieService.findMovieByTitle(createMovieDto.title)
    if (exisitngTitle) throw new BadRequestException('Movie already exist')
    if (!createMovieDto.image) throw new BadRequestException('Image is required')
    if (!createMovieDto.description) throw new BadRequestException('Description is required')
    if (!createMovieDto.duration_min) throw new BadRequestException('Duration_min is required')
    if (!createMovieDto.rating) throw new BadRequestException('Rating is required')
    if (!createMovieDto.price) throw new BadRequestException('Price is required')
    if (!createMovieDto.status) throw new BadRequestException('Status is required')

    const movie = await this.movieService.createMovie(createMovieDto);
    return new MovieEntity(movie)
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllMovies(@Query('title') title?: string, @Query('status') status?: MovieStatusEnum) {
    if (status && !Object.values(MovieStatusEnum).includes(status.toLocaleUpperCase() as MovieStatusEnum)) {
      throw new BadRequestException('Status not valid')
    }
    const movies = await this.movieService.findAllMovie(title, status);
    return movies.map(movie => new MovieEntity(movie))
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneMovie(@Param('id') id: string) {
    const res = await this.movieService.findOneMovie(+id)
    if (!res) {
      throw new BadRequestException()
    }
    return new MovieEntity(res)
  }


  @Patch(':id')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateMovie(@Req() req: Request, @Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    const existingMovie = await this.movieService.findOneMovie(+id)
    if (!existingMovie) throw new BadRequestException()

    if (updateMovieDto.title && updateMovieDto.title !== existingMovie.title) {
      const exisitngTitle = await this.movieService.findMovieByTitle(updateMovieDto.title)
      if (exisitngTitle) {
        throw new BadRequestException('Title already exists. Please choose a different title.')
      }
    }

    // if (!updateMovieDto.image) {
    //   throw new BadRequestException('Image is required')
    // }
    // if (!updateMovieDto.description) {
    //   throw new BadRequestException('Description is required')
    // }
    // if (!updateMovieDto.duration_min) {
    //   throw new BadRequestException('Duration_min is required')
    // }
    // if (!updateMovieDto.rating) {
    //   throw new BadRequestException('Rating is required')
    // }
    // if (!updateMovieDto.price) {
    //   throw new BadRequestException('Price is required')
    // }
    // if (!updateMovieDto.status) {
    //   throw new BadRequestException('Status is required')
    // }
    const res = await this.movieService.updateOneMovie(+id, updateMovieDto)
    return res
  }


  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(HttpExceptionFilter)
  async removeMovie(@Req() req: Request, @Param('id') id: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    const existingMovie = await this.movieService.findOneMovie(+id)
    if (!existingMovie) throw new BadRequestException()
    const res = await this.movieService.removeMovie(+id)
    return new MovieEntity(res)
  }
}


@Controller('import')
export class ExcelController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly movieService: MovieService
  ) { }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('movie')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './upload', // Specify the destination folder
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);
          const fileName = file.fieldname + '-' + uniqueSuffix + extension;
          cb(null, fileName);
        },
      }),
    }),
  )
  async importMovie(@UploadedFile() file: Express.Multer.File) {
    const moviesData = await this.excelService.readDataFromExcel(file)
    console.log(moviesData);

    const res = await this.movieService.importMovie(moviesData)
    return res
  }
}