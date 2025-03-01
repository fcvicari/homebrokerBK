import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, OrderType } from '@prisma/client';
import { assetRepositoryMock } from '../../test/mocks/asset.repository.mock';
import { jwtServiceMock } from '../../test/mocks/jwtService.mock';
import { orderRepositoryMock } from '../../test/mocks/order.repository.mock';
import { passwordHashMock } from '../../test/mocks/password.hash.mock';
import { userRepositoryMock } from '../../test/mocks/user.repository.mock';
import { walletRepositoryMock } from '../../test/mocks/wallet.repository.mock';
import { OrdersController } from './orders.controller';

describe('OrderController Tests', () => {
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

      expect(order.id).not.toBeNull();
    });
  });

  describe('Cancel order', () => {
    test('Order ID is required', async () => {
      const req = { user: { id: '1' } }

      await expect(controller.deleteOrder('', req)).rejects.toHaveProperty('statusCode', 400);
      await expect(controller.deleteOrder('', req)).rejects.toHaveProperty('message', 'ID is required and must be provided.');
    });

    test('Order ID is exists', async () => {
      const req = { user: { id: '1' } }

      await expect(controller.deleteOrder('IDNotExists', req)).rejects.toHaveProperty('statusCode', 404);
      await expect(controller.deleteOrder('IDNotExists', req)).rejects.toHaveProperty('message', 'Order not found.');
    });

    test('Order does not belong to the user', async () => {
      const req = { user: { id: 'IDUser' } }

      await expect(controller.deleteOrder('1', req)).rejects.toHaveProperty('statusCode', 401);
      await expect(controller.deleteOrder('1', req)).rejects.toHaveProperty('message', 'You do not have permission to access this order.');
    });

    test('Order has already been executed', async () => {
      const req = { user: { id: '1' } }

      await expect(controller.deleteOrder('2', req)).rejects.toHaveProperty('statusCode', 401);
      await expect(controller.deleteOrder('2', req)).rejects.toHaveProperty('message', 'Order has already been executed.');
    });

    test('Success.', async () => {
      const req = { user: { id: '1' } }

      const order = await controller.deleteOrder('1', req);

      await expect(order.status).toEqual(OrderStatus.CANCELED)
    });
  })

});
