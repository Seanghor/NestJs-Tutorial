import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GenderEnum, UserType } from '@prisma/client';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }


  async createUser(createUserDto: CreateUserDto) {
    const users = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (users) {
      throw new Error('Email already exists');
    }

    createUserDto.role = createUserDto.role as UserType;
    const res = await this.prisma.user.create({
      data: { ...createUserDto },
    });
    return res;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  }

  async findAllUser(role?: UserType, gender?: GenderEnum) {
    if (role) {
      role = role.toUpperCase() as UserType;
      const users = await this.prisma.user.findMany({
        where: { role: role as UserType },
      });
      return users
    }
    else if (gender) {
      gender = gender.toUpperCase() as GenderEnum;
      const users = await this.prisma.user.findMany({
        where: { gender: gender as GenderEnum },
      });
      return users
    }
    else if (role && gender) {
      gender = gender.toUpperCase() as GenderEnum;
      role = role.toUpperCase() as UserType;
      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            { gender: gender as GenderEnum },
            { role: role as UserType }
          ]
        },
      });
      return users
    }
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
    return user
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: {
        id: id
      }
    })
    return user
  }

}
