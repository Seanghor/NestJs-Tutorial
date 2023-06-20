import { ScreeningStatusEnum } from "@prisma/client";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty } from "class-validator";

export class CreateScreeningDto {
    @IsNotEmpty()
    movieId: number

    @IsNotEmpty()
    auditoriumId: number

    @IsNotEmpty()
    date_show: Date

    @IsNotEmpty()
    duration_min: number
    
    @IsNotEmpty()
    @IsDate()
    startTime: Date 

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
