import { Injectable } from '@nestjs/common';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return await this.prisma.order.create({
      data,
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await this.prisma.order.findUnique({
      where: { id },
    });
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELED
      }
    });

    return order
  }

}
