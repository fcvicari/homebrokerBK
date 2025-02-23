import { Wallet } from "@prisma/client";
import { WalletRepository } from "@src/wallets/wallet/wallet.repository";

export const walletMock = [
  {
    id: '1',
    name: 'Carteira 1',
    balance: 0,
    amount: 0,
    dividends: 0,
    userID: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Carteira 2',
    balance: 0,
    amount: 0,
    dividends: 0,
    userID: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Carteira 1',
    balance: 0,
    amount: 0,
    dividends: 0,
    userID: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as Wallet[];

export const walletServiceMock = {
  provide: WalletRepository,
  useValue: {
    create: jest
      .fn()
      .mockImplementation(({ name }) => {
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
    getUniqueById: jest.fn().mockImplementation(({ id }) => {
      const wallet = walletMock.filter((wallet) => {
        if (wallet.id === id) {
          return wallet;
        }
      });
      if (wallet[0]) {
        return Promise.resolve(wallet[0]);
      } else {
        return Promise.resolve(null);
      }
    }),
    delete: jest.fn().mockResolvedValue(true),
    getWalletsByUser: jest.fn().mockImplementation((userId: string) => {
      const wallets = walletMock.filter((wallet) => {
        if (wallet.userID === userId) {
          return wallet;
        }
      });
      return Promise.resolve(wallets);
    }),
  },
};
