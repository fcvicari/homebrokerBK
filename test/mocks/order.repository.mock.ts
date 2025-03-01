import { Order, Prisma } from "@prisma/client";
import { OrderRepository } from "@src/orders/orders.repository";

export const orderMock = [] as Order[];

export const orderRepositoryMock = {
  provide: OrderRepository,
  useValue: {
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
