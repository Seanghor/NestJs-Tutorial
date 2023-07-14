import { MovieService } from './../src/modules/movie/movie.service';
import { CreateAuditoriumDto } from './../src/modules/auditorium/dto/create-auditorium.dto';
// prisma/seed.ts
import { MovieStatusEnum, PrismaClient } from '@prisma/client';
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

    // 3 address
    const cenimaList = [
        {
            name: "MAJOR CINEPLEX AEON MALL PHNOM PENH",
            address: "#132,Street Samdach Sothearos , Sangkat Tonle Bassac, Phnom Penh(Aeon1)",
            phone: "099999999",
            map: null
        },
        {
            name: "MAJOR CINEPLEX AEON SEN SOK",
            address: "Street 1003, Phnom Penh (Aeon Mall Sen Sok)",
            phone: "09888888",
            map: null
        },
        {
            name: "MAJOR CINEPLEX AEON MEAN CHEY",
            address: "Phum Prek Talong 3, Dangkat Chak Angre Krom, Khan Mean Chey, Phnom Penh",
            phone: "09777777",
            map: null
        },
    ]
    for (let i = 0; i < cenimaList.length; i++) {
        const cenima = await prisma.campus.create({
            data: {
                name: cenimaList[i].name,
                address: cenimaList[i].address,
                phone: cenimaList[i].phone,
                map: cenimaList[i].map,
            }
        })
        console.table({ cenima })
    }


    // create 3 movie:
    const movieList = [
        {
            title: "Three Kingdoms",
            tmovieTypeype: "ACTION",
            image: "https://www.sonypictures.com/sites/default/files/styles/max_560x840/public/title-key-art/spidermannowayhome_onesheet_rating_extended_V1.jpg?itok=zCHneiV0",
            trailer: "https://www.majorcineplex.com.kh/showtime?movies=HO00001213",
            description: "description",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "COMING_SOON"
        },
        {
            title: "Fast and Furious 7",
            image: "https://www.sonypictures.com/sites/default/files/styles/max_560x840/public/title-key-art/spidermannowayhome_onesheet_rating_extended_V1.jpg?itok=zCHneiV0",
            trailer: "https://www.majorcineplex.com.kh/showtime?movies=HO00001213",
            tmovieTypeype: "ACTION",
            description: "description",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "NOW_SHOWING"
        },
        {
            title: "365days",
            image: "https://www.sonypictures.com/sites/default/files/styles/max_560x840/public/title-key-art/spidermannowayhome_onesheet_rating_extended_V1.jpg?itok=zCHneiV0",
            trailer: "https://www.majorcineplex.com.kh/showtime?movies=HO00001213",
            tmovieTypeype: "ACTION",
            description: "description",
            duration_min: 120,
            rating: 6.4,
            price: 7.5,
            status: "TOP_MOVIE"
        },
    ]

    // create movie
    for (let i = 0; i < movieList.length; i++) {
        const movie = await prisma.movie.create({
            data: {
                title: movieList[i].title,
                image: movieList[i].image,
                trailer: movieList[i].trailer,
                description: "description",
                duration_min: 120,
                rating: 6.4,
                price: 7.5,
                status: movieList[i].status as MovieStatusEnum
            }
        })
        console.table({ movie })
    }


    // create 9 auditorium
    for (let i = 1; i <= 9; i++) {
        const auditorium = await prisma.auditorium.create({
            data: {
                name: `A-00${i}`,
                num_seats: i % 2 == 0 ? 55 : 60,
                isAvailable: true
            }
        })
        console.table({ auditorium })
    }

    // create screening at cenima1:
    for (let i = 1; i < 3; i++) {
        const screening = await prisma.screening.create({
            data: {
                movieId: i,
                auditoriumId: i,
                campusId: 1,
                date_show: "2023-06-30T00:00:00.000Z",
                duration_min: 70,
                startTime: "1970-01-01T13:10:00.000Z",
                endTime: "1970-01-01T14:20:00.000Z",
                status: "COMING_SOON",
                isAvailable: true,
            }
        })

        const auditorium = await prisma.auditorium.findUnique({
            where: {
                id: screening.auditoriumId
            }
        })
        const maxSeat = auditorium.num_seats
        for (let j = 1; j <= maxSeat; j++) {
            const seats = await prisma.seat.create({
                data: {
                    customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
                    auditoriumId: auditorium.id,
                    screeningId: screening.id
                }
            })
        }

        // const seat = await prisma.seat.create({

        // })
        console.table({ screening })
    }

    // create screening at cenima2:
    for (let i = 1; i < 3; i++) {
        const screening2 = await prisma.screening.create({
            data: {
                movieId: i,
                auditoriumId: i + 3,
                campusId: 2,
                date_show: "2023-06-30T00:00:00.000Z",
                duration_min: 70,
                startTime: "1970-01-01T13:10:00.000Z",
                endTime: "1970-01-01T14:20:00.000Z",
                status: "COMING_SOON",
                isAvailable: true,
            }
        })

        const auditorium = await prisma.auditorium.findUnique({
            where: {
                id: screening2.auditoriumId
            }
        })
        const maxSeat = auditorium.num_seats
        for (let j = 1; j <= maxSeat; j++) {
            const seats = await prisma.seat.create({
                data: {
                    customId: i == 1 ? `D-${j}` : i == 2 ? `E-${j}` : `F-${j}`,
                    auditoriumId: auditorium.id,
                    screeningId: screening2.id
                }
            })
        }

        // const seat = await prisma.seat.create({

        // })
        console.table({ screening2 })
    }

    // create screening at cenima3:
    for (let i = 1; i < 3; i++) {
        const screening3 = await prisma.screening.create({
            data: {
                movieId: i,
                auditoriumId: i + 6,
                campusId: 3,
                date_show: "2023-06-30T00:00:00.000Z",
                duration_min: 70,
                startTime: "1970-01-01T13:10:00.000Z",
                endTime: "1970-01-01T14:20:00.000Z",
                status: "COMING_SOON",
                isAvailable: true,
            }
        })

        const auditorium = await prisma.auditorium.findUnique({
            where: {
                id: screening3.auditoriumId
            }
        })
        const maxSeat = auditorium.num_seats
        for (let j = 1; j <= maxSeat; j++) {
            const seats = await prisma.seat.create({
                data: {
                    customId: i == 1 ? `G-${j}` : i == 2 ? `H-${j}` : `I-${j}`,
                    auditoriumId: auditorium.id,
                    screeningId: screening3.id
                }
            })
        }

        // const seat = await prisma.seat.create({

        // })
        console.table({ screening3 })
    }
    return admin
}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });