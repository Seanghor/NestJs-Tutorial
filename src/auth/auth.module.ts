import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IsAuthService } from '../middlewares/isAuth';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IsAuthService,PrismaService],
})
export class AuthModule {}
