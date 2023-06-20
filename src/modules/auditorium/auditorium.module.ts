import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuditoriumService } from './auditorium.service';
import { AuditoriumController } from './auditorium.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/utils/jwt';
import { IsAuthService } from 'src/middlewares/middlewares.service';

@Module({
  controllers: [AuditoriumController],
  providers: [AuditoriumService, PrismaService, JwtService],
})
export class AuditoriumModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      .forRoutes(AuditoriumController)
  }
}
