import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) { }


  create(createSeatDto: CreateSeatDto) {
    return 'This action adds a new seat';
  }

  async findAll(auditoriumId?: number) {
    if (auditoriumId) {
      const res = await this.prisma.seat.findMany({
        where: {
          auditoriumId: auditoriumId
        },
        orderBy:{
          id:'asc'
        }
      })
      // ------------------------------------------
      // Normal array
      const normalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      // Dimensions of the desired array
      const rows = 10;
      const columns = 6;
      // Create the array with rows and columns
      const arrayWithRowsColumns = [];

      // Iterate over the normal array and organize elements into rows and columns
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
          const element = res[i * columns + j];
          row.push(element);
        }
        arrayWithRowsColumns.push(row);
      }
      // Print the array with rows and columns
      // arrayWithRowsColumns.forEach(row => console.log(row));
      console.log("------------------ Start -------------------");
      console.log(arrayWithRowsColumns);
      console.log("-------------------- Finish ----------------");
      
      return arrayWithRowsColumns
      // -------------------------------------



    }
    const res = await this.prisma.seat.findMany()
    return res
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }

  update(id: number, updateSeatDto: UpdateSeatDto) {
    return `This action updates a #${id} seat`;
  }

  remove(id: number) {
    return `This action removes a #${id} seat`;
  }
}
