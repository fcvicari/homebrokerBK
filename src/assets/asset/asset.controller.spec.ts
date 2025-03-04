import { Test, TestingModule } from '@nestjs/testing';
import { assetRepositoryMock } from '../../../test/mocks/asset.repository.mock';
import { jwtServiceMock } from '../../../test/mocks/jwtService.mock';
import { passwordHashMock } from '../../../test/mocks/password.hash.mock';
import { userRepositoryMock } from '../../../test/mocks/user.repository.mock';
import { AssetController } from './asset.controller';

describe('AssetController Tests', () => {
  let assetController: AssetController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        passwordHashMock,
        userRepositoryMock,
        jwtServiceMock,
        assetRepositoryMock
      ],
    }).compile();

    assetController = moduleFixture.get<AssetController>(AssetController);
  });

  it('Should be defined', () => {
    expect(assetController).toBeDefined();
  });

  it('Create asset - success', async () => {
    const newAsset = {
      name: 'New Asset Name',
      symbol: 'NEWASS',
      price: 99.99,
      image: 'https://image.com',
    };

    const asset = await assetController.post(newAsset)

    expect(asset.id).toEqual('idNewAsset');
    expect(asset.symbol).toEqual(newAsset.symbol);
    expect(asset.price).toEqual(newAsset.price);
  });

  it('Update asset - success', async () => {
    const newAsset = {
      name: 'New Asset Name',
      symbol: 'ASST1',
      price: 99.99,
      image: 'https://image.com',
    };

    const asset = await assetController.post(newAsset)

    expect(asset.id).toEqual('1');
    expect(asset.symbol).toEqual(newAsset.symbol);
    expect(asset.price).toEqual(newAsset.price);
  });

  it('Get asset by symbol', async () => {
    const asset = await assetController.getBySymbol('ASST1');

    expect(asset?.id).toEqual('1');
    expect(asset?.name).toEqual('Asset 1');
    expect(asset?.price).toEqual(1.45);
  });

  it('Get asset by invalid Symbol', async () => {
    await expect(
      assetController.getBySymbol('INVALID'),
    ).rejects.toHaveProperty('statusCode', 404);
  });

  it('Delete asset - id does not exist', async () => {
    await expect(
      assetController.delete('idNotExists'),
    ).rejects.toHaveProperty('statusCode', 404);
  });

  it('Delete asset - exist Order', async () => {
    await expect(
      assetController.delete('1'),
    ).rejects.toHaveProperty('statusCode', 400);
  });

  it('Delete asset - exist Wallet', async () => {
    await expect(
      assetController.delete('2'),
    ).rejects.toHaveProperty('statusCode', 400);
  });

  it('Delete asset - success', async () => {
    expect(await assetController.delete('3')).toEqual(true);
  });
});
