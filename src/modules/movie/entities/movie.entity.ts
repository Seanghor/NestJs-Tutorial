import { Movie, MovieStatus } from "@prisma/client";

export class MovieEntity implements Movie {
    id: number;
    title: string;
    image: string;
    description: string;
    duration_min: number;
    rating: number;
    price: number;
    status: MovieStatus;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<MovieEntity>) {
        Object.assign(this, partial);
    }
}
