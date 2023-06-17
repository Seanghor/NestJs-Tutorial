// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { JwtService } from 'src/utils/jwt';
import * as  bcrypt from 'bcrypt'
const prisma = new PrismaClient();
// const jwtService = new JwtService().hashPassword; // Create an instance of JwtService

const hashPassword = async(password: string) => {
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
            },        {
                name: "Bou Leapheng",
                email: "bouleapheng@gmail.com",
                password: await hashPassword("password"),
                role: "USER",
                enable: true,
                gender: "MALE"
            },        {
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
    return admin
}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });