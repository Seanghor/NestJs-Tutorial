import { GenderEnum, User, RoleEnum } from "@prisma/client";
import { IsEnum } from "class-validator";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
    id: number;
    name: string;
    email: string;
    gender: GenderEnum;
    role: RoleEnum;
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
    name: string;
    email: string;
    role: RoleEnum;
    createdAt: Date;
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializeUser>) {
        Object.assign(this, partial);
    }
}