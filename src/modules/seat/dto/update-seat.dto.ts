import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatDto } from './create-seat.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SeatStatusEnum } from '@prisma/client';

export class UpdateSeatStatusDto extends PartialType(CreateSeatDto) {
    @IsNotEmpty()
    @IsEnum(SeatStatusEnum)
    status: SeatStatusEnum

    
    customId: string

    auditoriumId: number

    screeningId: string;
}