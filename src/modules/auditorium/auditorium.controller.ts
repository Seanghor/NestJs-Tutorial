import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { AuditoriumService } from './auditorium.service';
import { CreateAuditoriumDto } from './dto/create-auditorium.dto';
import { UpdateAuditoriumDto } from './dto/update-auditorium.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { Request} from 'express';


@Controller('auditorium')
export class AuditoriumController {
  constructor(private readonly auditoriumService: AuditoriumService) { }

  @UseFilters(HttpExceptionFilter)
  @Post()
  async createOne(@Req() req: Request, @Body() createAuditoriumDto: CreateAuditoriumDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    if (!createAuditoriumDto.name) throw new BadRequestException('Name is required')
    if (!createAuditoriumDto.num_seats) throw new BadRequestException('Num_seats is required')
    if (!createAuditoriumDto.isAvailable) throw new BadRequestException('isAvailable is required')

    const existingAuditorium = await this.auditoriumService.findAuditoriumByName(createAuditoriumDto.name)
    if (existingAuditorium) {
      throw new BadRequestException('Name already exist')
    }
    const res = await this.auditoriumService.createAuditorium(createAuditoriumDto)
    return res
  }

  @Get()
  async findAllAuditorium() {
    const res = await this.auditoriumService.findAllAuditorium()
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Get(':id')
  async findOneAuditorium(@Param('id') id: string) {
    const res = await this.auditoriumService.findOneAuditorium(+id)
    if (!res) {
      throw new BadRequestException()
    }
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Patch(':id')
  async updateAuditorium(@Req() req: Request, @Param('id') id: string, @Body() updateAuditoriumDto: UpdateAuditoriumDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    const existingAuditorium = await this.auditoriumService.findOneAuditorium(+id)
    if (!existingAuditorium) {
      throw new BadRequestException()
    }
    if (updateAuditoriumDto.name && updateAuditoriumDto.name !== existingAuditorium.name) {
      const existingName = await this.auditoriumService.findAuditoriumByName(updateAuditoriumDto.name)
      if (existingName) {
        throw new BadRequestException('Name already exists. Please choose a different name.')
      }
    }
    const res = await this.auditoriumService.updateOneAuditorium(+id, updateAuditoriumDto);
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @Delete(':id')
  async removeAuditorium(@Req() req: Request, @Param('id') id: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    const existingAuditorium = await this.auditoriumService.findOneAuditorium(+id)
    if (!existingAuditorium) {
      throw new BadRequestException()
    }
    const res = await this.auditoriumService.removeAuditorium(+id)
    return res
  }
}
