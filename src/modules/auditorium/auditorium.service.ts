import { UpdateAuditoriumDto } from './dto/update-auditorium.dto';
import { Injectable } from '@nestjs/common';
import { CreateAuditoriumDto } from './dto/create-auditorium.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditoriumService {
  constructor(private readonly prisma: PrismaService) { }

  async findAuditoriumByName(name: string) {
    const res = await this.prisma.auditorium.findUnique({
      where: {
        name: name
      }
    })
    return res
  }

  async createAuditorium(createAuditoriumDto: CreateAuditoriumDto) {
    const res = await this.prisma.auditorium.create({
      data: createAuditoriumDto
    })
    return res
  }

  async findAllAuditorium() {
    const res = await this.prisma.auditorium.findMany()
    return res
  }

  async findOneAuditorium(id: number) {
    const res = await this.prisma.auditorium.findUnique({
      where: {
        id: id
      }
    })
    return res
  }

  async updateOneAuditorium(id: number, updateAuditoriumDto: UpdateAuditoriumDto) {
    const res = await this.prisma.auditorium.update({
      where: {
        id: id
      },
      data: updateAuditoriumDto
    })
    return res
  }

  async removeAuditorium(id: number) {
    const res = await this.prisma.auditorium.delete({
      where: {
        id: id
      }
    })
    return res
  }
}


