import { MovieService } from './../src/modules/movie/movie.service';
import { CreateAuditoriumDto } from './../src/modules/auditorium/dto/create-auditorium.dto';
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { JwtService } from 'src/utils/jwt';
import * as  bcrypt from 'bcrypt'
const prisma = new PrismaClient();
// const jwtService = new JwtService().hashPassword; // Create an instance of JwtService

const hashPassword = async (password: string) => {
    const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
    const salt = await bcrypt.genSalt(+saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function main() {
    const admin = await prisma.user.createMany({
        data: [
            {
                name: "Hai Seanghor",
                email: "hai.seanghor20@kit.edu.kh",
                password: await hashPassword("password"),
                role: "ADMIN",
                enable: true,
                gender: "MALE"
            },
            {
                name: "Rith Kimsour",
                email: "rithkimsour@gmail.com",
                password: await hashPassword("password"),
                role: "EMPLOYEE",
                enable: true,
                gender: "FEMALE"
            },
            {
                name: "Amm Cheachamreoun",
                email: "ammcheachamreoun@gmail.com",
                password: await hashPassword("password"),
                role: "USER",
                enable: true,
                gender: "MALE"
            }, {
                name: "Bou Leapheng",
                email: "bouleapheng@gmail.com",
                password: await hashPassword("password"),
                role: "USER",
                enable: true,
                gender: "MALE"
            }, {
                name: "Queen Rafaela",
                email: "rafaela@gmail.com",
                password: await hashPassword("password"),
                role: "USER",
                enable: true,
                gender: "FEMALE"
            },
        ]
    });
    console.table({ admin })

    // create 3 auditorium
    for (let i = 1; i <= 9; i++) {
        const auditorium = await prisma.auditorium.create({
            data: {
                name: `A-00${i}`,
                num_seats: 60,
                isAvailable: true
            }
        })
        console.table({ auditorium })

        for (let j = 1; j <= auditorium.num_seats; j++) {
            const seats = await prisma.seat.create({
                data: {
                    customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
                    auditoriumId: auditorium.id
                }
            })
        }

    }

    // create 3 movie:
    const movieList = [
        {
            title: "Three Kingdoms",
            image: "image",
            description: "description",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "COMING_SOON"
        },
        {
            title: "Fast and Furious 7",
            image: "image",
            description: "description",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "COMING_SOON"
        },
        {
            title: "365days",
            image: "image",
            description: "description",
            duration_min: 120,
            rating: 6.4,
            price: 7.5,
            status: "COMING_SOON"
        },
    ]

    for (let i = 0; i < movieList.length; i++) {
        const movie = await prisma.movie.create({
            data: {
                title: movieList[i].title,
                image: "image",
                description: "description",
                duration_min: 120,
                rating: 6.4,
                price: 7.5,
                status: "COMING_SOON"
            }
        })
        console.table({ movie })
    }

    // create screening:
    for (let i = 1; i < 3; i++) {
        const movie = await prisma.screening.create({
            data: {
                movieId: i,
                auditoriumId: i,
                date_show: "2023-06-30T00:00:00.000Z",
                duration_min: 70,
                startTime: "1970-01-01T13:10:00.000Z",
                endTime: "1970-01-01T14:20:00.000Z",
                status: "COMING_SOON",
                isAvailable: true,
            }
        })
        console.table({ movie })
    }

    return admin
}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });