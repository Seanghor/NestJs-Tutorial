import { MovieStatus } from "@prisma/client";
import { IsEmpty, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    title: string

    @IsEmpty()
    image:string 

    @IsEmpty()
    description: string

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsEnum(MovieStatus)
    status: MovieStatus
}
