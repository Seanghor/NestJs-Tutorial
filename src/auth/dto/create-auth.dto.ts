import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator/types/decorator/decorators";
import { uuidv4 } from 'uuid';
export class CreateAuthDto {

}

export class CreateRefreshTokenDto {
    @IsNotEmpty()
    jti: uuidv4;
    refreshToken:string;
    userId: number;
}

export class CreateTokenDto {}


