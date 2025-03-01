import { Order, OrderStatus, OrderType, Prisma } from "@prisma/client";
import { OrderRepository } from "@src/orders/orders.repository";

export const orderMock = [
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
] as Order[];

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
    findById: jest
      .fn()
      .mockImplementation((id: string) => {
        const order = orderMock.find(order => order.id === id)

        if (order) {
          return order
        } else {
          return null
        }
      }),
    cancelOrder: jest
      .fn()
      .mockImplementation((id: string) => {
        const order = orderMock.find(order => order.id === id)

        if (order) {
          return { ...order, status: OrderStatus.CANCELED }
        } else {
          return null
        }
      }),
  },
};
