import { Movie, MovieStatusEnum } from "@prisma/client";
import { Exclude } from "class-transformer";

export class MovieEntity implements Movie {
    id: number;
    title: string;
    image: string;
    description: string;
    duration_min: number;
    rating: number;
    price: number;
    status: MovieStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<MovieEntity>) {
        Object.assign(this, partial);
    }
}


export class MovieImportEntity {
    id: number;
    title: string;
    image: string;
    description: string;
    duration_min: number;
    rating: number;
    price: number;
    status: MovieStatusEnum;
    constructor(partial: Partial<MovieImportEntity>) {
        Object.assign(this, partial);
    }
}
