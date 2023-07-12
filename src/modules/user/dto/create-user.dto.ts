import { GenderEnum, RoleEnum } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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

}
