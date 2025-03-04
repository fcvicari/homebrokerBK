import { Injectable } from '@nestjs/common';
import { Assets, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class AssetRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.AssetsCreateInput): Promise<Assets> {
    return await this.prisma.assets.create({
      data,
    });
  }

  async update(id: string, { name, symbol, image, price }: Prisma.AssetsUpdateInput): Promise<Assets> {
    return await this.prisma.assets.update({
      where: {
        id
      },
      data: {
        name,
        symbol,
        image,
        price,
        updatedAt: new Date(),
      },
    });
  }

  async getAllAssets(): Promise<Assets[] | null> {
    return await this.prisma.assets.findMany();
  }

  async getUniqueById(id: string) {
    return await this.prisma.assets.findUnique({
      where: {
        id
      },
      include: {
        WalletAsset: true,
        Order: true,
      },
    });
  }

  async delete(id: string): Promise<any> {
    await this.prisma.assets.delete({
      where: {
        id
      }
    });

    return null;
  }

  async getAssetsBySymbol(symbol: string): Promise<Assets | null> {
    return await this.prisma.assets.findUnique({
      where: {
        symbol
      }
    });
  }
}
