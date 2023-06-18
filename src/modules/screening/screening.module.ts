import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { IsAuthService } from 'src/middlewares/middlewares.service';

@Module({
  controllers: [ScreeningController],
  providers: [ScreeningService]
})
export class ScreeningModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      .forRoutes(ScreeningController)
  }
}
