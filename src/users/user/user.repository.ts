import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async activateUser(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    });
  }

  async getUniqueById(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({ where });
  }

  async findByEmail(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where,
    });
  }

  async alterPassword(id: string, password: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
        active: true,
      },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;

    return await this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<any> {
    await this.prisma.user.delete({
      where,
    });
  }
}
