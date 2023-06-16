import { UserService } from './../modules/user/user.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from 'src/utils/jwt';
import { CreateAuthDto, CreateRefreshTokenDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { v4 as uuidv4 } from 'uuid';


@Controller('/login')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly JwtService: JwtService,
  ) { }
  // constructor(private readonly UserService: UserService ) {}
  @UseFilters(HttpExceptionFilter)
  @Post()
  async logIn(@Body() { email, password }) {
    if (!email) throw new BadRequestException('Email is required')
    if (!password) throw new BadRequestException('Password is required')

    const existingUser = await this.userService.findOneByEmail(email)
    if (!existingUser) throw new NotFoundException('Email not found')
    if (existingUser.password !== password) throw new BadRequestException('Invalid login credentials.')

    const jti = uuidv4()
    const { accessToken, refreshToken } = await this.JwtService.generateToken(existingUser, jti)

    const dataRefreshTokenToWhitelist = {
      jti: jti,
      refreshToken: refreshToken,
      userId: existingUser.id
    } as CreateRefreshTokenDto
    await this.authService.addRefreshTokenToWhitelist(dataRefreshTokenToWhitelist)
    return {
      accessToken,
      refreshToken
    }
  }
}


export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly JwtService: JwtService,
  ) { }

  // @Post()
  // async register(@Body() { }) {
    
  // }
}