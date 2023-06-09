import { SeatStatusEnum } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateSeatDto {
    @IsNotEmpty()
    customId: string

    @IsNotEmpty()
    @IsEnum(SeatStatusEnum)
    status: SeatStatusEnum

    @IsNotEmpty()
    auditoriumId: number

    @IsNotEmpty()
    screeningId: string;

}
