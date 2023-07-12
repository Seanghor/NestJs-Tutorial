import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import {  UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { IsAuthService } from 'src/middlewares/middlewares.service';
import { JwtService } from 'src/utils/jwt';


@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PrismaService, IsAuthService, JwtService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .exclude({ path: 'user', method: RequestMethod.GET }) // Exclude the middleware from the '/user' GET endpoint
      .forRoutes(UserController);
  }
}
