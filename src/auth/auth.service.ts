import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  // used when we create a refresh token.
  async addRefreshTokenToWhitelist({ jti, refreshToken, userId }) {
    return await this.prisma.refreshToken.create({
      data: {
        id: jti,
        hashedToken: refreshToken(refreshToken),
        userId,
      }
    })
  }

  // used to check if the token sent by the client is in the database.
  async findRefreshTokenById(id: string) {
    return await this.prisma.refreshToken.findUnique({
      where: { id }
    })
  }

  // soft delete tokens after usage.
  async deleteRefreshTokenById(id: string) {
    return await this.prisma.refreshToken.delete({
      where:{id}
    })
  }

  async revokeToken(userId:number) {
    return await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true }
    })
  } 

}
