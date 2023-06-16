import { Module } from '@nestjs/common';
import { IsAuthService } from './middlewares.service';
import { MiddlewaresController } from './middlewares.controller';
import { APP_FILTER } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from 'src/model/http-exception.filter';

@Module({
  controllers: [MiddlewaresController],
  providers: [IsAuthService, {
    provide: APP_FILTER,
    useClass: UnauthorizedExceptionFilter,
  }]
})
export class MiddlewaresModule {}
