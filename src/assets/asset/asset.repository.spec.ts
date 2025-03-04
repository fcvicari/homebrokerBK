import { Test, TestingModule } from '@nestjs/testing';
import { Assets, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { AssetRepository } from './asset.repository';

describe('AssetRepository Tests', () => {
  let assetRepository: AssetRepository;
  let prisma: PrismaService;

  let assetMock: Assets[] = [
    {
      id: '1',
      name: 'Asset 1',
      symbol: 'ASST1',
      image: 'https://image.com',
      price: 1.45,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Asset 2',
      symbol: 'ASST2',
      image: 'https://image.com',
      price: 25.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const mockPrismaService = {
    assets: {
      create: jest
        .fn()
        .mockImplementation(({ name, symbol }: Prisma.AssetsCreateInput) => {
          return Promise.resolve({
            id: 'idNewAsset',
            name,
            symbol,
            image: 'https://image.com',
            price: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
      findUnique: jest
        .fn()
        .mockImplementation((param) => {
          const { id, symbol } = param.where;

          if (!id && !symbol) {
            return Promise.resolve(null);
          }

          const asset = assetMock.find((asset) => asset.id === id || asset.symbol === symbol);

          return Promise.resolve(asset);
        }),
      findMany: jest
        .fn()
        .mockImplementation(() => {
          return assetMock;
        }),
      delete: jest.fn(),
      update: jest
        .fn()
        .mockImplementation(({ where, data }) => {
          const { id } = where;
          const { name, symbol, image, price } = data;

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
            updatedAt: new Date(),
            createdAt: new Date()
          });
        }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    assetRepository = module.get<AssetRepository>(AssetRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Create asset', async () => {
    const data = {
      name: 'New Asset Name',
      symbol: 'NEWASS',
    };

    const newAsset = await assetRepository.create(data);

    expect(newAsset.id).not.toBeNull();
    expect(newAsset.id).toEqual('idNewAsset');
    expect(newAsset.price).toEqual(1);
  });

  it('return all Assets', async () => {
    const assets = await assetRepository.getAllAssets();

    expect(assets?.length).toBeGreaterThan(0);
  });

  it('Update asset', async () => {
    const updateAsset = await assetRepository.update('1', {
      name: "Update asset name", symbol: "ASST1", image: "https://image.com", price: 3
    });

    expect(updateAsset?.id).toEqual('1');
    expect(updateAsset?.name).toEqual('Update asset name');
    expect(updateAsset?.price).toEqual(3);
  });

  it('should return a Asset by ID', async () => {
    const asset = await assetRepository.getUniqueById('1');

    expect(asset?.id).toEqual('1');
    expect(asset?.symbol).toEqual('ASST1');
  });

  it('should return a asset by id does not exist', async () => {
    const asset = await assetRepository.getUniqueById('WalletNotExists');

    expect(asset).not.toBeDefined();
  });

  it('should delete a asset by ID', async () => {
    await assetRepository.delete('1');

    expect(prisma.assets.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should return a asset by Symbol', async () => {
    const asset = await assetRepository.getAssetsBySymbol('ASST1');

    expect(asset?.id).toEqual('1');
  });

  it('should return a asset by id does not exist', async () => {
    const asset = await assetRepository.getAssetsBySymbol('WalletNotExists');

    expect(asset).not.toBeDefined();
  });
});
