import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { MovieStatus } from '@prisma/client';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @IsNotEmpty()
    title: string

    @IsEmpty()
    image: string

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
