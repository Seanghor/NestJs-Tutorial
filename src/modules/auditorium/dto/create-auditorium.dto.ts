import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAuditoriumDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    num_seats: number

    @IsNotEmpty()
    @IsBoolean()
    isAvailable: boolean

}
