import { IsBoolean, IsNotEmpty } from "class-validator"

export class CreateTicketDto {
    @IsNotEmpty()
    screeningId: number

    customId: string

    @IsNotEmpty()
    seat: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsBoolean()
    payStatus: boolean

    @IsNotEmpty()
    @IsBoolean()
    active: boolean

    @IsNotEmpty()
    bookingId: number
}
