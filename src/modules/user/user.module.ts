import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PrismaService],
})
export class UserModule {}
