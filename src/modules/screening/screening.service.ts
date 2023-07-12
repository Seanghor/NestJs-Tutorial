import { Auditorium } from './../auditorium/entities/auditorium.entity';
import { Seat } from './../seat/entities/seat.entity';
import { prisma } from './../../../prisma/db';
import { Injectable } from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatStatusEnum } from '@prisma/client';

@Injectable()
export class ScreeningService {
  constructor(private prisma: PrismaService) { }

  async createScreening(createScreeningDto: CreateScreeningDto) {
    const screening = await this.prisma.screening.create({
      data: createScreeningDto,
    })

    const auditorium = await this.prisma.auditorium.findUnique({
      where: {
        id: screening.auditoriumId
      }
    })

    const maxSeat = auditorium.num_seats
    for (let j = 1; j <= maxSeat; j++) {
      const seats = await prisma.seat.create({
        data: {
          customId: `A-${j}`,
          auditoriumId: auditorium.id,
          status: SeatStatusEnum.AVAILABLE,
          screeningId: screening.id
        }
      })
    }
    return screening
  }

  async findAll(movie?: string) {
    const id = Number(movie);
    // console.log("Is number:", !isNaN(id));
    if (movie && !isNaN(Number(movie))) {
      const res = await this.prisma.screening.findMany({
        where: {
          movieId: +id
        },
        orderBy:
        {
          "date_show": "asc"
        },
        include: {
          auditorium: true
        }
      })
      const result = [];
      let currentDate = null;
      let currentGroup = null;

      for (const item of res) {
        const itemDate = item.date_show.toISOString().split('T')[0].slice(0); // Extract yy-mm-dd

        if (itemDate !== currentDate) {
          currentDate = itemDate;
          currentGroup = [];
          result.push({
            date: itemDate,
            group: currentGroup,
          });
        }

        currentGroup.push(item);
      }

      return result
    }
    if (movie && isNaN(id)) {
      const res = await this.prisma.screening.findMany({
        where: {
          movie: {
            title: movie.toLocaleLowerCase()
          }
        },
        include: {
          auditorium: true
        }
      })
      // make dimensional array different by show_date:
      const result = [];
      let currentDate = null;
      let currentGroup = null;

      for (const item of res) {
        const itemDate = item.date_show.toISOString().split('T')[0];
        console.log(itemDate);


        if (itemDate !== currentDate) {
          currentDate = itemDate;
          currentGroup = [];
          result.push({
            date: itemDate,
            group: currentGroup,
          });
        }

        currentGroup.push(item);
      }

      return result;
    }
    const res = await this.prisma.screening.findMany()
    return res
  }

  async findOne(id: number) {
    const res = await this.prisma.screening.findUnique({
      where: {
        id: id
      },
      include: {
        auditorium: true
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
