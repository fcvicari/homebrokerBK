import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Wallet } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { WalletRepository } from './wallet.repository';

describe('WalletRepository Tests', () => {
  let walletRepository: WalletRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    wallet: {
      create: jest
        .fn()
        .mockImplementation(({ name }: Prisma.WalletCreateInput) => {
          return Promise.resolve({
            id: 'idNewWallet',
            name,
            balance: 0,
            amount: 0,
            dividends: 0,
            userID: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
      findUnique: jest
        .fn()
        .mockImplementation((param) => {
          const { id } = param.where;

          if (id !== 'wallet123') {
            return Promise.resolve(null);
          }

          const wallet: Wallet = {
            id: 'wallet123',
            name: 'My Wallet',
            userID: 'user123',
            balance: 0,
            amount: 0,
            dividends: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return Promise.resolve(wallet);
        }),
      delete: jest.fn(),
      findMany: jest
        .fn()
        .mockImplementation((param) => {
          const { userID } = param.where;

          if (userID !== 'user123') {
            return Promise.resolve(null);
          }

          const wallets: Wallet[] = [
            { id: 'wallet1', name: 'Wallet 1', userID: 'user123', balance: 0, amount: 0, dividends: 0, createdAt: new Date(), updatedAt: new Date() },
            { id: 'wallet2', name: 'Wallet 2', userID: 'user123', balance: 0, amount: 0, dividends: 0, createdAt: new Date(), updatedAt: new Date() },
          ];

          return Promise.resolve(wallets);
        }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    walletRepository = module.get<WalletRepository>(WalletRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Create wallet', async () => {
    const data = {
      name: 'walletname',
      user: {
        connect: {
          id: '1',
        },
      },
    };

    const newWallet = await walletRepository.create(data);

    expect(newWallet.id).not.toBeNull();
    expect(newWallet.id).toEqual('idNewWallet');
  });

  it('should return a wallet by ID', async () => {
    const wallet = await walletRepository.getUniqueById({ id: 'wallet123' });

    expect(wallet?.id).toEqual('wallet123');
  });

  it('should return a wallet by id does not exist', async () => {
    const wallet = await walletRepository.getUniqueById({ id: 'WalletNotExists' });

    expect(wallet).toBeNull();
  });

  it('should delete a wallet by ID', async () => {
    await walletRepository.delete({ id: 'wallet123' });

    expect(prisma.wallet.delete).toHaveBeenCalledWith({
      where: { id: 'wallet123' },
    });
  });


  it('should return all wallets for a user', async () => {
    const wallets = await walletRepository.getWalletsByUser('user123');

    expect(wallets?.length).toEqual(2);
  });

  it('should return null if user has no wallets', async () => {
    const wallets = await walletRepository.getWalletsByUser('NoWalletUser');

    expect(wallets).toBeNull();
  });
});
