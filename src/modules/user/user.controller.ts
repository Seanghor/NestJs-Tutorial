import { IsAuthService } from './../../middlewares/middlewares.service';

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UseInterceptors, Req, Res, Next, UseGuards } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenderEnum, UserType } from '@prisma/client';
import { HttpExceptionFilter, } from 'src/model/http-exception.filter';
import { BadRequestException, ClassSerializerInterceptor, MiddlewareConsumer, NestModule, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SerializeUser, UserEntity } from './entities/user.entity';
import { Request, Response, NextFunction } from 'express';
// import { IsAuthMiddleware } from 'src/middlewares/middlewares.service';


@Controller('/register')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
  ) { }


  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    if (!createUserDto.email) throw new BadRequestException('Email is required');
    if (!createUserDto.password) throw new BadRequestException('Password is required');
    if (createUserDto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.role = 'USER'
    const response = await this.userService.createUser(createUserDto);
    return new UserEntity(response)
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // create user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const user = req.payload
    if (user.role !== 'ADMIN') throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    if (!createUserDto.email) throw new BadRequestException('Email is required');
    if(!createUserDto.gender) throw new BadRequestException('Gender is required')
    if(!Object.values(GenderEnum).includes(createUserDto.gender.toUpperCase() as GenderEnum)) throw new BadRequestException('Gender is not valid')
    if (!createUserDto.role) throw new BadRequestException('Role is required');
    if (!Object.values(UserType).includes(createUserDto.role.toUpperCase() as UserType)) {
      throw new BadRequestException('Role is not valid');
    }
    if (!createUserDto.password) throw new BadRequestException('Password is required');
    if (createUserDto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const response = await this.userService.createUser(createUserDto);
    return new UserEntity(response)
  }

  // get all user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllUser(@Req() req: Request, @Query('role') role?: UserType, @Query('gender') gender?: GenderEnum) {
    const userRole = req.payload?.role; // Access the role property from the payload object
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedException('🚫 User is Un-Authorized 🚫')
    }
    if (role && !Object.values(UserType).includes(role.toUpperCase() as UserType)) {
      throw new BadRequestException()
    }
    if (gender && !Object.values(GenderEnum).includes(gender.toUpperCase() as GenderEnum)) {
      throw new BadRequestException()
    }
    const response = await this.userService.findAllUser(role, gender)
    console.log(response);

    return response.map(user => new UserEntity(user))
  }

  // get user by id
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const res = await this.userService.findUserById(+id)
    if (!res) {
      throw new NotFoundException()
    }
    return new UserEntity(res)
  }


  // delete user:
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    const existingUser = await this.userService.findUserById(+id)
    if (!existingUser) throw new BadRequestException()

    const user = await this.userService.deleteUser(+id)
    return new UserEntity(user)
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findByEmail(@Body('email') email: string) {
  //   return this.userService.findOneByEmail(email);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}


