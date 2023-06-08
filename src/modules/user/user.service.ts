import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
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
    } catch (error) {
      return { status: 400, message: error.message };
    }
  }

  async findAllUser(role?: UserType) {
    try {
      if (role) {
        role = role.toUpperCase() as UserType;
        return await this.prisma.user.findMany({
          where: { role: role as UserType },
        });
      }
      return await this.prisma.user.findMany();
    } catch (error) {
      return { status: 400, message: error.message };
    }
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
