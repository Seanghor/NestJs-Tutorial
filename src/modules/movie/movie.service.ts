import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { BadRequestException, Injectable, UseFilters, } from '@nestjs/common';
import { MovieStatus, PrismaClient } from '@prisma/client';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) { }

  // find by title
  @UseFilters(HttpExceptionFilter)
  async findMovieByTitle(title: string) {
    const res = await this.prisma.movie.findUnique({
      where: {
        title: title
      }
    })
    return res
  }

  // createOne
  @UseFilters(HttpExceptionFilter)
  async createMovie(createMovieDto: CreateMovieDto) {
    createMovieDto.title = createMovieDto.title.toLocaleLowerCase()
    const res = await this.prisma.movie.create({
      data: createMovieDto
    })
    return res
  }

  // findMany
  async findAllMovie(title?: string, status?: MovieStatus) {
    if (title && !status) {
      const titleLower = title.toLocaleLowerCase()
      const res = await this.prisma.movie.findMany({
        where: {
          title: titleLower
        }
      })
      return res
    }
    else if (!title && status) {
      const res = await this.prisma.movie.findMany({
        where: {
          status: status.toLocaleUpperCase() as MovieStatus
        }
      })
      return res
    }
    else if (title && status) {
      const titleLower = title.toLocaleLowerCase()
      const res = await this.prisma.movie.findMany({
        where: {
          AND: [
            { title: titleLower },
            { status: status.toLocaleUpperCase() as MovieStatus }
          ]
        }
      })
      return res
    }
    const res = await this.prisma.movie.findMany()
    return res
  }

  // findOne
  async findOneMovie(id: number) {
    const res = await this.prisma.movie.findUnique({
      where: {
        id: id
      }
    })
    return res
  }

  async updateOneMovie(id: number, updateMovieDto: UpdateMovieDto) {
    updateMovieDto.title = updateMovieDto.title.toLocaleLowerCase()
    const res = await this.prisma.movie.update({
      where: {
        id: id
      },
      data: updateMovieDto
    })
    return res
  }

  // Delete
  async removeMovie(id: number) {
    const res = await this.prisma.movie.delete({
      where: {
        id: id
      }
    })
    return res
  }
}
