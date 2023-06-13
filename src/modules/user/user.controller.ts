import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UseInterceptors } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from '@prisma/client';
import { HttpExceptionFilter, } from 'src/model/http-exception.filter';
import { BadRequestException, ClassSerializerInterceptor, NotFoundException } from '@nestjs/common';
import { SerializeUser, UserEntity } from './entities/user.entity';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // create user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    if (!createUserDto.email) throw new BadRequestException('Email is required');
    if (!createUserDto.role) throw new BadRequestException('Role is required');
    if (!Object.values(UserType).includes(createUserDto.role.toUpperCase() as UserType)) {
      throw new BadRequestException('Role is not valid');
    }
    if (!createUserDto.password) throw new BadRequestException('Password is required');
    if (createUserDto.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const isExist = await this.userService.findOneByEmail(createUserDto.email);
    console.log(isExist || "null");
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const res = await this.userService.createUser(createUserDto);
    return new UserEntity(res)
  }

  // get all user
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllUser(@Query('role') role?: UserType) {
    console.log('Query role: ', role);

    if (role && !Object.values(UserType).includes(role.toUpperCase() as UserType)) {
      throw new BadRequestException()
    }
    const res = await this.userService.findAllUser(role) as UserEntity[]
    return res
  }

  // get user by id
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findUserById(+id)
    if (!res) {
      throw new BadRequestException()
    }
    return new UserEntity(res)
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
