import { Assets, Prisma } from "@prisma/client";
import { AssetRepository } from "@src/assets/asset/asset.repository";

export const assetMock = [
  {
    id: '1',
    name: 'Asset 1',
    symbol: 'ASST1',
    image: 'https://image.com',
    price: 1.45,
    Order: [
      {
        id: 'Ord1'
      },
      {
        id: 'Ord2'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Asset 2',
    symbol: 'ASST2',
    image: 'https://image.com',
    price: 5.55,
    WalletAsset: [
      {
        id: 'WalletAsset1'
      },
      {
        id: 'WalletAsset2'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Asset 3',
    symbol: 'ASST3',
    image: 'https://image.com',
    price: 3.33,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as Assets[];

export const assetRepositoryMock = {
  provide: AssetRepository,
  useValue: {
    create: jest
      .fn()
      .mockImplementation(({ name, symbol, image, price }: Prisma.AssetsCreateInput) => {
        return Promise.resolve({
          id: 'idNewAsset',
          name,
          symbol,
          image,
          price,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
    update: jest
      .fn()
      .mockImplementation((id: string, { name, symbol, image, price }: Prisma.AssetsUpdateInput) => {
        const asset = assetMock.find((asset) => asset.id === id);

        if (!asset) {
          return Promise.resolve(null);
        }

        return Promise.resolve({
          id,
          name,
          symbol,
          image,
          price,
        });
      }),
    getUniqueById: jest.fn().mockImplementation((id: string) => {
      if (!id) {
        return Promise.resolve(null);
      }

      const asset = assetMock.find((asset) => asset.id === id);

      return Promise.resolve(asset);
    }),
    delete: jest.fn().mockResolvedValue(true),
    getAllAssets: jest.fn().mockImplementation(() => {
      return assetMock;
    }),
    getAssetsBySymbol: jest.fn().mockImplementation((symbol: string) => {
      if (!symbol) {
        return Promise.resolve(null);
      }

      const asset = assetMock.find((asset) => asset.symbol === symbol);

      return Promise.resolve(asset);
    }),
  },
};
