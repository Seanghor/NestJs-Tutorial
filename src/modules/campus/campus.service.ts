import { Injectable } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampusService {
  constructor(private readonly prisma: PrismaService) { }

  async findUniqueByName(name?: string) {
    const existing = await this.prisma.campus.findUnique({
      where: {
        name: name
      }
    })
    return existing
  }

  async createCampus(createCampusDto: CreateCampusDto) {
    const res = await this.prisma.campus.create({
      data: createCampusDto
    })
    return res
  }

  async findAllCampus() {
    const res = await this.prisma.campus.findMany()
    return res
  }

  async findOneCampus(id: number) {
    const res = await this.prisma.campus.findUnique({
      where: {
        id: id
      }
    })
    return res
  }

  async updateCampus(id: number, updateCampusDto: UpdateCampusDto) {
    const res = await this.prisma.campus.update({
      where: {
        id: id
      },
      data: updateCampusDto
    })
    return res
  }

  async remove(id: number) {
    const res = await this.prisma.campus.delete({
      where: {
        id: id
      }
    })
    return res
  }
}
