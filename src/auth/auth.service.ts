import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefreshTokenDto } from './dto/create-auth.dto';
import { JwtService } from 'src/utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/modules/user/user.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService) { }

  // used when we create a refresh token.
  async addRefreshTokenToWhitelist(createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.prisma.refreshToken.create({
      data: {
        id: createRefreshTokenDto.jti,
        hashedToken: this.jwtService.hashToken(createRefreshTokenDto.refreshToken),
        userId: createRefreshTokenDto.userId,
      }
    })
  }

  // used to check if the token sent by the client is in the database.
  async findRefreshTokenById(id: string) {
    return await this.prisma.refreshToken.findUnique({
      where: {
        id
      }
    })
  }

  // soft delete tokens after usage.
  async deleteRefreshTokenById(id: string) {
    return await this.prisma.refreshToken.delete({
      where: { id }
    })
  }

  async revokeToken(userId: number) {
    return await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true }
    })
  }

  @UseFilters(HttpExceptionFilter)
  async logIn(email: string, password: string) {
    const existingUser = await this.userService.findOneByEmail(email)
    if (!existingUser) throw new NotFoundException('Email not found')

    const hashPassword = existingUser.password
    const isMatchPassword = await this.jwtService.comparePassword(password, hashPassword)
    if (!isMatchPassword) { throw new BadRequestException('Invalid login credentials.') }

    const jti = uuidv4()
    const { accessToken, refreshToken } = await this.jwtService.generateToken(existingUser, jti)
    const dataRefreshTokenToWhitelist = {
      jti: jti,
      refreshToken: refreshToken,
      userId: existingUser.id
    } as CreateRefreshTokenDto
    await this.addRefreshTokenToWhitelist(dataRefreshTokenToWhitelist)
    return {
      accessToken,
      refreshToken
    }
  }

}


