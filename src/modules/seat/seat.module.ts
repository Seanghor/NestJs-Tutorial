import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { AuditoriumService } from '../auditorium/auditorium.service';

@Module({
  controllers: [SeatController],
  providers: [SeatService, PrismaService, AuditoriumService]
})
export class SeatModule {}
