import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { WalletAssetRepository } from './walletAsset.repository';

describe('WalletAssetRepository Tests', () => {
  let repository: WalletAssetRepository;

  const mockPrismaService = {
    walletAsset: {
      create: jest
        .fn()
        .mockImplementation(({ quantity, avgPrice, amount, wallet, asset }: Prisma.WalletAssetCreateInput) => {
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
        .mockImplementation(({ where, data }) => {
          const { quantity = 0, avgPrice = 0, amount = 0, wallet, asset } = data;

          return Promise.resolve({
            id: where.id,
            quantity,
            avgPrice,
            amount,
            walletID: wallet?.connect?.id,
            assetID: asset?.connect?.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletAssetRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<WalletAssetRepository>(WalletAssetRepository);
  });

  it('Include asset in wallet', async () => {
    const data = {
      quantity: 13,
      avgPrice: 1.345,
      amount: 17.485,
      wallet: {
        connect: { id: 'IDWallet' },
      },
      asset: { connect: { id: 'IDAsset' } },
    };

    const assetWallet = await repository.create(data);

    expect(assetWallet.id).not.toBeNull();
    expect(assetWallet.id).toEqual('NewID');
  });

  it('Update asset in wallet', async () => {
    const data = {
      quantity: 13,
      avgPrice: 1.345,
      amount: 17.485,
      wallet: { connect: { id: 'IDWallet' } },
      asset: { connect: { id: 'IDAsset' } },
    };

    const assetWallet = await repository.update('ID', data);

    expect(assetWallet.id).not.toBeNull();
    expect(assetWallet.id).toEqual('ID');
  });
});
