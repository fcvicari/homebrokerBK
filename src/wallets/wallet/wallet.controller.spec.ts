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
          Id: '1',
        },
      },
    )

    expect(wallet.id).toEqual('idNewWallet');
  });

  it('Should retrieve wallets for a given user with no data', async () => {
    const wallets = await walletController.getWallets({
      user: {
        Id: 'idUserNotExists',
      },
    });

    expect(wallets?.length).toEqual(0);
  });

  it('Should retrieve all wallets for a given user', async () => {
    const wallets = await walletController.getWallets({
      user: {
        Id: '1',
      },
    });

    expect(wallets?.length).toBeGreaterThan(0);

    wallets?.forEach(wallet => {
      expect(wallet.userID).toEqual('1');
    });
  });

  it('Delete wallet - id does not exist', async () => {
    await expect(
      walletController.delete('idNotExists'),
    ).rejects.toHaveProperty('statusCode', 404);
  });

  it('Delete wallet - success', async () => {
    expect(await walletController.delete('1')).toEqual(true);
  });
});
