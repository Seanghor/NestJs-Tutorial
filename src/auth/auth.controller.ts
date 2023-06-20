import { UserService } from './../modules/user/user.service';
import { Controller, Post, Body, UseFilters, BadRequestException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from 'src/utils/jwt';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { GenderEnum } from '@prisma/client';


@Controller('/login')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }
  // constructor(private readonly UserService: UserService ) {}
  @UseFilters(HttpExceptionFilter)
  @Post()
  async logIn(@Body() { email, password }) {
    if (!email) throw new BadRequestException('Email is required')
    if (!password) throw new BadRequestException('Password is required')
    return await this.authService.logIn(email, password)
  }
}


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
    if (!createUserDto.gender) throw new BadRequestException('Gender is required');
    if (!Object.values(GenderEnum).includes(createUserDto.gender.toUpperCase() as GenderEnum)) throw new BadRequestException('Gender is not valid')
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