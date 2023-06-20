import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    screeningId: number

    @IsNotEmpty()
    num: number

    @IsNotEmpty()
    price_for_1: number

    total: number
    
    @IsNotEmpty()
    @IsBoolean()
    payStatus: boolean
}
