import { Test, TestingModule } from '@nestjs/testing';
import { OrderType } from '@prisma/client';
import { assetRepositoryMock } from '../../test/mocks/asset.repository.mock';
import { jwtServiceMock } from '../../test/mocks/jwtService.mock';
import { orderRepositoryMock } from '../../test/mocks/order.repository.mock';
import { passwordHashMock } from '../../test/mocks/password.hash.mock';
import { userRepositoryMock } from '../../test/mocks/user.repository.mock';
import { walletRepositoryMock } from '../../test/mocks/wallet.repository.mock';
import { OrdersController } from './orders.controller';

describe('AssetController Tests', () => {
  let controller: OrdersController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        passwordHashMock,
        userRepositoryMock,
        jwtServiceMock,
        assetRepositoryMock,
        walletRepositoryMock,
        orderRepositoryMock
      ],
    }).compile();

    controller = moduleFixture.get<OrdersController>(OrdersController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create order', () => {
    test('Wallet not exists.', async () => {
      const body = {
        walletID: 'IDnotExists',
        asset: 'XBL',
        orderType: OrderType.BUY,
        quantity: 10,
        price: 12.67,
      }

      const req = { user: { id: '1' } }

      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('statusCode', 404);
      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('message', 'The wallet is not exists.');
    });

    test('Wallet not owned by the user.', async () => {
      const body = {
        walletID: '1',
        asset: 'XBL',
        orderType: OrderType.BUY,
        quantity: 10,
        price: 12.67,
      }

      const req = { user: { id: '3' } }

      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('statusCode', 401);
      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('message', 'User not authorized to use this wallet.');
    });

    test('Asset not exists.', async () => {
      const body = {
        walletID: '1',
        asset: 'XBL',
        orderType: OrderType.BUY,
        quantity: 10,
        price: 12.67,
      }

      const req = { user: { id: '1' } }

      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('statusCode', 404);
      await expect(controller.createOrder(body, req)).rejects.toHaveProperty('message', 'The asset symbol is not exists.');
    });

    test('Success.', async () => {
      const body = {
        walletID: '1',
        asset: 'ASST1',
        orderType: OrderType.BUY,
        quantity: 10,
        price: 12.67,
      }

      const req = { user: { id: '1' } }

      const order = await controller.createOrder(body, req);

      await expect(order.id).not.toBeNull();
    });

  });

});
