import { Injectable } from '@nestjs/common';
import { Prisma, Wallet } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class WalletRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.WalletCreateInput): Promise<Wallet> {
    return await this.prisma.wallet.create({
      data,
    });
  }

  async getUniqueById(where: Prisma.WalletWhereUniqueInput): Promise<Wallet | null> {
    return await this.prisma.wallet.findUnique({ where });
  }

  async delete(where: Prisma.WalletWhereUniqueInput): Promise<any> {
    await this.prisma.wallet.delete({
      where,
    });
  }

  async getWalletsByUser(userid: string): Promise<Wallet[] | null> {
    return await this.prisma.wallet.findMany({ where: { userID: userid } });
  }
}
