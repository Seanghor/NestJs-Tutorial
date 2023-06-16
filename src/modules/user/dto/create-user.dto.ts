import { GenderEnum, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  @IsEnum(UserType)
  @IsNotEmpty()
  role: UserType

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum

}
