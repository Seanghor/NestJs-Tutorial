import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import {  RegisterController, UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { IsAuthService } from 'src/middlewares/middlewares.service';


@Module({
  controllers: [UserController, RegisterController],
  exports: [UserService],
  providers: [UserService, PrismaService, IsAuthService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .exclude({ path: 'user', method: RequestMethod.GET }) // Exclude the middleware from the '/user' GET endpoint
      .forRoutes(UserController);
  }
}
