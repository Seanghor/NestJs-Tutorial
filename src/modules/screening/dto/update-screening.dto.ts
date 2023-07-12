import { PartialType } from '@nestjs/mapped-types';
import { CreateScreeningDto } from './create-screening.dto';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { ScreeningStatusEnum } from '@prisma/client';

export class UpdateScreeningDto extends PartialType(CreateScreeningDto) {
    @IsNotEmpty()
    movieId: number

    @IsNotEmpty()
    auditoriumId: number
    
    @IsNotEmpty()
    date_show: Date

    @IsNotEmpty()
    @IsDate()
    startTime: Date | string

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    @IsDate()
    endTime: Date

    @IsNotEmpty()
    @IsEnum(ScreeningStatusEnum)
    status: ScreeningStatusEnum

    @IsNotEmpty()
    @IsBoolean()
    isAvailable: boolean
}
