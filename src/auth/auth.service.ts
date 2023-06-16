import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefreshTokenDto } from './dto/create-auth.dto';
import { JwtService } from 'src/utils/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  // used when we create a refresh token.
  async addRefreshTokenToWhitelist(createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.prisma.refreshToken.create({
      data: {
        id: createRefreshTokenDto.jti,
        hashedToken: this.jwt.hashToken(createRefreshTokenDto.refreshToken),
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

}


