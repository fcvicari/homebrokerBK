import { Test, TestingModule } from '@nestjs/testing';
import { Assets, OrderStatus, OrderType, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { OrderRepository } from './orders.repository';

describe('AssetRepository Tests', () => {
  let repository: OrderRepository;
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
    prisma = module.get<PrismaService>(PrismaService);
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

});
