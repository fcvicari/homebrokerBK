import { Test, TestingModule } from '@nestjs/testing';
import { jwtServiceMock } from '../../../test/mocks/jwtService.mock';
import { passwordHashMock } from '../../../test/mocks/password.hash.mock';
import { userRepositoryMock } from '../../../test/mocks/user.repository.mock';
import { walletRepositoryMock } from '../../../test/mocks/wallet.repository.mock';
import { WalletController } from './wallet.controller';

describe('WalletController Tests', () => {
  let walletController: WalletController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        passwordHashMock,
        userRepositoryMock,
        jwtServiceMock,
        walletRepositoryMock
      ],
    }).compile();

    walletController = moduleFixture.get<WalletController>(WalletController);
  });

  it('Should be defined', () => {
    expect(walletController).toBeDefined();
  });

  it('Create wallet - success', async () => {
    const wallet = await walletController.post(
      {
        name: 'walletname',
      },
      {
        user: {
          id: '1',
        },
      },
    )

    expect(wallet.id).toEqual('idNewWallet');
  });

  it('Should retrieve wallets for a given user with no data', async () => {
    const wallets = await walletController.getWallets({
      user: {
        id: 'idUserNotExists',
      },
    });

    expect(wallets?.length).toEqual(0);
  });

  it('Should retrieve all wallets for a given user', async () => {
    const wallets = await walletController.getWallets({
      user: {
        id: '1',
      },
    });

    expect(wallets?.length).toBeGreaterThan(0);

    wallets?.forEach(wallet => {
      expect(wallet.userID).toEqual('1');
    });
  });

  it('Get the wallet for the user - id does not exist', async () => {
    await expect(
      walletController.getWallet('idNotExists', { user: { id: 'IdUserNotExists' } }),
    ).rejects.toHaveProperty('statusCode', 404);
  });

  it('Get the wallet for the user - wallet exists but does not belong to the user', async () => {
    await expect(
      walletController.getWallet('1', { user: { id: 'IdUserNotExists' } }),
    ).rejects.toHaveProperty('statusCode', 401);
  });

  it('Get the wallet for the user - success', async () => {
    const wallet = await walletController.getWallet('1', { user: { id: '1' } });

    expect(wallet.id).toEqual('1');
    expect(wallet.name).toEqual('Wallet 1');
  });


  it('Delete wallet - id does not exist', async () => {
    await expect(
      walletController.delete('idNotExists', { user: { id: 'IdUserNotExists' } }),
    ).rejects.toHaveProperty('statusCode', 404);
  });

  it('Delete wallet - wallet exists but does not belong to the user', async () => {
    await expect(
      walletController.delete('1', { user: { id: 'IdUserNotExists' } }),
    ).rejects.toHaveProperty('statusCode', 401);
  });

  it('Delete wallet - success', async () => {
    expect(await walletController.delete('1', { user: { id: '1' } })).toEqual(true);
  });
});
