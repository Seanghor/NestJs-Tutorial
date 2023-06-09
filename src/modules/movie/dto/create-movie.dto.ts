import { MovieStatusEnum, MovieTypeEnum } from "@prisma/client";
import { IsEmpty, IsEnum, IsNotEmpty } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

    @IsEmpty()
    description: string

    @IsEmpty()
    trailer: string | null;

    @IsNotEmpty()
    movieType: MovieTypeEnum;

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}

export class ImportMovieDto {
    id: number

    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

    @IsEmpty()
    description: string

    @IsEmpty()
    trailer: string | null;

    @IsNotEmpty()
    movieType: MovieTypeEnum;

    @IsNotEmpty()
    duration_min: number

    @IsNotEmpty()
    rating: number

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}



