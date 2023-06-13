import { Injectable } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { TokenPayload } from './dto/util.dto'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class UtilService {
    constructor(private prisma: PrismaService) { }

    // generateToken
    generateAccessToken(user: User) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        } as unknown as TokenPayload

        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        })
    }

    generateRefreshToken(user: User, jti: string) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            jti,
        } as unknown as TokenPayload

        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        })
    }

    generateToken(user: User, jti: string) {
        const accessToken = this.generateAccessToken(user)
        const refreshToken = this.generateRefreshToken(user, jti)
        return { accessToken, refreshToken }
    }

    hashToken(token: string) {
        return crypto.createHash('sha256').update(token).digest('hex')
    }
}

