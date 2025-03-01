import { Prisma, WalletAsset } from "@prisma/client";
import { WalletAssetRepository } from "@src/wallets/walleasset/walletAsset.repository";

export const assetMock = [
  {
    id: 'ID1',
    walletID: '1',
    assetID: '1',
    quantity: 10,
    avgPrice: 1.45,
    amount: 14.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ID2',
    walletID: '2',
    assetID: '1',
    quantity: 10,
    avgPrice: 1.45,
    amount: 14.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ID1',
    walletID: '3',
    assetID: '2',
    quantity: 10,
    avgPrice: 1.45,
    amount: 14.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as WalletAsset[];

export const walletassetRepositoryMock = {
  provide: WalletAssetRepository,
  useValue: {
    create: jest
      .fn()
      .mockImplementation((data: Prisma.WalletAssetCreateInput) => {
        const { quantity = 0, avgPrice = 0, amount = 0, wallet, asset } = data;

        return Promise.resolve({
          id: 'NewID',
          quantity,
          avgPrice,
          amount,
          wallet,
          asset,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }),
    update: jest
      .fn()
      .mockImplementation((id: string, data: Prisma.WalletAssetUpdateInput = {}) => {
        if (!id) {
          throw new Error('Missing required "id" field in where clause');
        }

        const { quantity = 0, avgPrice = 0, amount = 0 } = data;

        return Promise.resolve({
          id: id,
          quantity,
          avgPrice,
          amount,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }),
  },
};
