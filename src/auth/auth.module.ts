import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { UserController } from 'src/modules/user/user.controller';
import { JwtService } from 'src/utils/jwt';


@Module({
  controllers: [AuthController],
  providers: [AuthService,PrismaService, UserService, JwtService, ],
})
export class AuthModule {}
