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

  async findAssetWallet(walletID: string, assetID: string): Promise<WalletAsset | null> {
    return await this.prisma.walletAsset.findUnique({
      where: {
        walletID_assetID: {
          walletID,
          assetID
        }
      },
    });
  }

  async update(id: string, data: Prisma.WalletAssetUpdateInput): Promise<WalletAsset> {
    return await this.prisma.walletAsset.update({
      data,
      where: { id },
    });
  }

}
