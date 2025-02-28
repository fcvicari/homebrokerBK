import { Test, TestingModule } from '@nestjs/testing';
import { jwtServiceMock } from '../../../test/mocks/jwtService.mock';
import { passwordHashMock } from '../../../test/mocks/password.hash.mock';
import { userRepositoryMock } from '../../../test/mocks/user.repository.mock';
import { walletRepositoryMock } from '../../../test/mocks/wallet.repository.mock';
import { walletassetRepositoryMock } from '../../../test/mocks/walletasset.repository.mock';
import { WalletAssetController } from './walletAsset.controller';

describe('WalletAssetController Tests', () => {
  let controller: WalletAssetController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WalletAssetController],
      providers: [
        passwordHashMock,
        userRepositoryMock,
        jwtServiceMock,
        walletRepositoryMock,
        walletassetRepositoryMock
      ],
    }).compile();

    controller = moduleFixture.get<WalletAssetController>(WalletAssetController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Insert asset into wallet - wallet does not exists', async () => {
    const data = {
      assetID: 'assetID',
      amount: 100,
      avgPrice: 10,
      quantity: 10,
      walletID: 'WalletNotFound',
    }

    const request = {
      user: {
        Id: '1',
      },
    }

    await expect(
      controller.post(data, request),
    ).rejects.toHaveProperty('statusCode', 401)

    await expect(
      controller.post(data, request),
    ).rejects.toHaveProperty('message', 'Wallet not found.')
  });

  it('Insert asset into wallet - wallet does not belong to the user', async () => {
    const data = {
      assetID: 'assetID',
      amount: 100,
      avgPrice: 10,
      quantity: 10,
      walletID: '1',
    }

    const request = {
      user: {
        Id: 'UserNotFound',
      },
    }

    await expect(
      controller.post(data, request),
    ).rejects.toHaveProperty('statusCode', 401)

    await expect(
      controller.post(data, request),
    ).rejects.toHaveProperty('message', 'You do not have permission to access this wallet.')
  });

  it('Insert asset into wallet - success', async () => {
    const data = {
      assetID: 'assetID',
      amount: 100,
      avgPrice: 10,
      quantity: 10,
      walletID: '1',
    }

    const request = {
      user: {
        Id: '1',
      },
    }

    const assetWallet = await controller.post(data, request);

    expect(assetWallet.id).not.toBeNull();
    expect(assetWallet.id).toEqual('NewID');
  });

  it('Update asset into wallet - success', async () => {
    const data = {
      id: 'ID1',
      assetID: '1',
      amount: 100,
      avgPrice: 10,
      quantity: 10,
      walletID: '1',
    }

    const request = {
      user: {
        Id: '1',
      },
    }

    const assetWallet = await controller.post(data, request);

    expect(assetWallet.id).not.toBeNull();
    expect(assetWallet.id).toEqual('ID1');
    expect(assetWallet.quantity).toEqual(10);
  });
});
