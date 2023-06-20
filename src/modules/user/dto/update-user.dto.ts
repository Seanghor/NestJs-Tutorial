import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { GenderEnum, RoleEnum } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    name: string
  
    @IsEmail()
    @IsNotEmpty()
    email: string
  
    @IsNotEmpty()
    password: string
  
    @IsEnum(RoleEnum)
    @IsNotEmpty()
    role: RoleEnum
  
    @IsEnum(GenderEnum)
    @IsNotEmpty()
    gender: GenderEnum

    @IsBoolean()
    @IsNotEmpty()
    enable: boolean
}
