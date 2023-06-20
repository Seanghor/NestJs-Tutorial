import { Controller, Get, Post, Body, Patch, Param, Delete, ClassSerializerInterceptor, UseFilters, UseInterceptors, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { Request } from 'express';

@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) { }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createCampus(@Req() req: Request, @Body() createCampusDto: CreateCampusDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    if (!createCampusDto.name) {
      throw new BadRequestException('Name is required')
    }
    else if (!createCampusDto.address) {
      throw new BadRequestException('Address is require')
    }
    else if (!createCampusDto.phone) {
      throw new BadRequestException('Phone is require')
    }

    const existing = await this.campusService.findUniqueByName(createCampusDto.name)
    if (existing) {
      throw new BadRequestException('Name already exists. Please choose a different Name.')
    }
    const res = await this.campusService.createCampus(createCampusDto);
    return res
  }

  @Get()
  async findAllCampus() {
    return await this.campusService.findAllCampus();
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneCampus(@Param('id') id: string) {
    const res = await this.campusService.findOneCampus(+id);
    if (!res) {
      throw new BadRequestException()
    }
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async updateCampus(@Req() req: Request, @Param('id') id: string, @Body() updateCampusDto: UpdateCampusDto) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    const existingCampus = await this.campusService.findOneCampus(+id)
    if (!existingCampus) {
      throw new BadRequestException()
    }

    if (updateCampusDto.name && updateCampusDto.name !== existingCampus.name) {
      const existingName = await this.campusService.findUniqueByName(updateCampusDto.name)
      if (existingName) {
        throw new BadRequestException('Name already exists. Please choose a different Name.')
      }
    }

    const res = await this.campusService.updateCampus(+id, updateCampusDto);
    return res
  }

  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async removeCampus(@Req() req: Request, @Param('id') id: string) {
    const user = req.payload
    if (!['ADMIN', 'EMPLOYEE'].includes(user.role)) {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    const existingCampus = await this.campusService.findOneCampus(+id)
    if (!existingCampus) {
      throw new BadRequestException()
    }
    const res = await this.campusService.remove(+id);
    return res
  }
}
