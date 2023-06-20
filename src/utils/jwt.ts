import { Injectable } from '@nestjs/common'
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto'
import { TokenPayload } from './dto/util.dto'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'
import * as  bcrypt from 'bcrypt'

@Injectable()
export class JwtService {
    constructor(private prisma: PrismaService) { }

    // generateToken
    generateAccessToken(user: User) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        } as unknown as TokenPayload
        return sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME
            // expiresIn: '120ms'
        })
    }

    generateRefreshToken(user: User, jti: string) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            jti,
        } as unknown as TokenPayload

        return sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        })
    }

    generateToken(user: User, jti: string) {
        const accessToken = this.generateAccessToken(user)
        const refreshToken = this.generateRefreshToken(user, jti)
        return { accessToken, refreshToken }
    }

    hashToken(token: string) {
        return createHash('sha256').update(token).digest('hex')
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
        const salt = await bcrypt.genSalt(+saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(password: string, hashPassword: string) {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch
    }

}

@Injectable()
export class GenerateCustomIDService {
    constructor(private prisma: PrismaService) { }
    private currentId = 0;

    generateAutoIncrementId(): string {
        const prefix = String.fromCharCode(97 + Math.floor(this.currentId / 100)); // ASCII code for 'a' is 97
        const suffix = String(this.currentId % 1000).padStart(3, '0');
        this.currentId++;
        return prefix + suffix;
    }

    private currentBookingId = 1;
    generateBookingIDAutoIncrement(): string {
        const id = String(this.currentBookingId).padStart(3, '0');
        this.currentBookingId++;
        return id;
    }



    // Get the latest custom ID from the database
    async getLatestCustomId(): Promise<string | null> {
        const lastTicket = await this.prisma.ticket.findFirst({
            orderBy: {
                id: 'desc',
            },
        });
        return lastTicket?.customId ?? null;
    }

    // Generate customId based on the latest custom ID
    private lastLatter
    private lastId
    async generateTicketCustomId(): Promise<string> {
        const latestCustomId = await this.getLatestCustomId();
        let currentPrefix: string;
        let currentNumber: number;

        if (latestCustomId) {
            const lastPrefix = latestCustomId.charAt(0);
            const lastNumber = parseInt(latestCustomId.slice(2), 10);

            // Increment the prefix and number based on the latest custom ID
            if (lastNumber === 99) {
                if (lastPrefix === 'Z') {
                    throw new Error('Cannot generate more IDs');
                }

                currentPrefix = String.fromCharCode(lastPrefix.charCodeAt(0) + 1);
                currentNumber = 0;
            } else {
                currentPrefix = lastPrefix;
                currentNumber = lastNumber + 1;
            }
        } else {
            // Start from the beginning if no previous custom IDs exist
            currentPrefix = 'A';
            currentNumber = 1;
        }

        const suffix = currentNumber.toString().padStart(2, '0');
        const customId = `${currentPrefix}-${suffix}`;

        return customId;
    }
}



