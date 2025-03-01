import { Test, TestingModule } from '@nestjs/testing';
import { Order, OrderStatus, OrderType, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { OrderRepository } from './orders.repository';

describe('AssetRepository Tests', () => {
  let repository: OrderRepository;

  let orderMock: Order[] = [
    {
      id: '1',
      assetId: '1',
      orderNumber: 'Order1',
      orderType: OrderType.BUY,
      priceExec: 0,
      quantityExec: 0,
      priceOrder: 1,
      quantityOrder: 1,
      status: OrderStatus.OPEN,
      userId: '1',
      walletId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      assetId: '1',
      orderNumber: 'Order2',
      orderType: OrderType.BUY,
      priceExec: 0,
      quantityExec: 0,
      priceOrder: 1,
      quantityOrder: 1,
      status: OrderStatus.EXECUTED,
      userId: '1',
      walletId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      assetId: '1',
      orderNumber: 'Order3',
      orderType: OrderType.BUY,
      priceExec: 0,
      quantityExec: 0,
      priceOrder: 1,
      quantityOrder: 1,
      status: OrderStatus.CANCELED,
      userId: '1',
      walletId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const mockPrismaService = {
    order: {
      create: jest
        .fn()
        .mockImplementation(({ orderNumber, asset, orderType, priceOrder, quantityOrder, user, wallet }: Prisma.OrderCreateInput) => {
          return Promise.resolve({
            id: 'NEWID',
            orderNumber,
            asset,
            orderType,
            priceOrder,
            quantityOrder,
            user,
            wallet,
            priceExec: 0,
            quantityExec: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
      findUnique: jest
        .fn()
        .mockImplementation(({ where }) => {
          const order = orderMock.find(order => order.id === where.id)

          if (order) {
            return order
          } else {
            return null
          }
        }),
      update: jest
        .fn()
        .mockImplementation(({ where }) => {
          const order = orderMock.find(order => order.id === where.id)
          if (order) {
            return { ...order, status: OrderStatus.CANCELED }
          } else {
            return null
          }
        }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
  });

  it('Create asset', async () => {
    const data = {
      orderNumber: "12345",
      asset: { connect: { id: "1" } },
      priceExec: 0,
      quantityExec: 0,
      status: OrderStatus.OPEN,
      orderType: OrderType.BUY,
      priceOrder: 12.67,
      quantityOrder: 10,
      user: { connect: { id: "1" } },
      wallet: { connect: { id: "1" } }
    };

    const newOrder = await repository.create(data);

    expect(newOrder.id).not.toBeNull();
    expect(newOrder.id).toEqual('NEWID');
  });

  it('Find order by ID - Order not found', async () => {
    const id = 'IDNotExists'
    const order = await repository.findById(id);

    expect(order).toBeNull();
  })

  it('Find order by ID - Order exists', async () => {
    const id = '1'
    const order = await repository.findById(id);

    expect(order).not.toBeNull();
  })

  it('Delete Order', async () => {
    const id = '1'
    const order = await repository.cancelOrder(id);

    expect(order.status).toEqual(OrderStatus.CANCELED);
  })
});
