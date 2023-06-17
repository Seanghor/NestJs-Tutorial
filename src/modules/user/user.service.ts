import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GenderEnum, RoleEnum } from '@prisma/client';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { JwtService } from 'src/utils/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }


  async createUser(createUserDto: CreateUserDto) {
    createUserDto.password = await this.jwtService.hashPassword(createUserDto.password)
    const users = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (users) {
      throw new Error('Email already exists');
    }

    createUserDto.role = createUserDto.role as RoleEnum;
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

  async findAllUser(role?: RoleEnum, gender?: GenderEnum) {
    console.log(role);
    console.log(gender);


    if (role && !gender) {
      role = role.toUpperCase() as RoleEnum;
      const users = await this.prisma.user.findMany({
        where: { role: role as RoleEnum },
      });
      return users
    }
    else if (gender && !role) {
      gender = gender.toUpperCase() as GenderEnum;
      const users = await this.prisma.user.findMany({
        where: { gender: gender as GenderEnum },
      });
      return users
    }
    else if (role && gender) {
      gender = gender.toUpperCase() as GenderEnum;
      role = role.toUpperCase() as RoleEnum;
      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            { gender: gender as GenderEnum },
            { role: role as RoleEnum }
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
