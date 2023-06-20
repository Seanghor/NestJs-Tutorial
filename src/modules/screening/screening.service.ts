import { prisma } from './../../../prisma/db';
import { Injectable } from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScreeningService {
  constructor(private prisma: PrismaService) { }

  async createScreening(createScreeningDto: CreateScreeningDto) {
    const res = await this.prisma.screening.create({
      data: createScreeningDto
    })
    return res
  }

  async findAll(movie?: string) {
    const id = Number(movie);
    // console.log("Is number:", !isNaN(id));
    if (movie && !isNaN(Number(movie))) {
      const res = await this.prisma.screening.findMany({
        where: {
          movieId: +id
        }
      })
      return res
    }
    if (movie && isNaN(id)) {
      const res = await this.prisma.screening.findMany({
        where: {
          movie: {
            title: movie.toLocaleLowerCase()
          }
        }
      })
      return res
    }
    const res = await this.prisma.screening.findMany()
    return res
  }

  async findOne(id: number) {
    const res = await this.prisma.screening.findUnique({
      where: {
        id: id
      }
    })
    return res
  }

  async update(id: number, updateScreeningDto: UpdateScreeningDto) {
    const res = await this.prisma.screening.update({
      where: {
        id: id
      },
      data: updateScreeningDto
    })
    return res
  }

  async remove(id: number) {
    const res = await this.prisma.screening.delete({
      where: {
        id: id
      }
    })
    return res
  }
}
