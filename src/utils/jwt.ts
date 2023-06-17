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

    async comparePassword(password:string, hashPassword:string) {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch
    }
}

