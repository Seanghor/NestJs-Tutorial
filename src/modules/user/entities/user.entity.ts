import { GenderEnum, User, UserType } from "@prisma/client";
import { IsEnum } from "class-validator";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
    id: number;
    email: string;
    name: string;
    gender: GenderEnum;
    role: UserType;
    enable: boolean;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}


export class SerializeUser {
    id: number;
    email: string;
    name: string;
    role: UserType;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializeUser>) {
        Object.assign(this, partial);
    }
}