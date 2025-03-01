import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return await this.prisma.order.create({
      data,
    });
  }

}
