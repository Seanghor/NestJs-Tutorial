import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController, RegisterController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from 'src/utils/jwt';


@Module({
  controllers: [AuthController, RegisterController],
  providers: [AuthService,PrismaService, UserService, JwtService, ],
})
export class AuthModule {}
