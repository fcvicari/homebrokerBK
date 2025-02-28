import { Injectable } from '@nestjs/common';
import { Prisma, WalletAsset } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class WalletAssetRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.WalletAssetCreateInput): Promise<WalletAsset> {
    return await this.prisma.walletAsset.create({
      data,
    });
  }

  async update(id: string, data: Prisma.WalletAssetUpdateInput): Promise<WalletAsset> {
    return await this.prisma.walletAsset.update({
      data,
      where: { id },
    });
  }

}
