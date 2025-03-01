import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { AssetRepository } from '@src/assets/asset/asset.repository';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { WalletRepository } from '@src/wallets/wallet/wallet.repository';
import { CreateOrderDTO } from './create.order.dto';
import { OrderRepository } from './orders.repository';

@ApiTags('Orders')
@ApiBearerAuth('jwt')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(
    private asset: AssetRepository,

    private wallet: WalletRepository,

    private order: OrderRepository,
  ) { }

  @ApiOperation({ summary: 'Order successfully created' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created.',
    type: CreateOrderDTO
  })
  @ApiResponse({
    status: 401,
    description: 'User not authorized to use this wallet.',
    example: {
      statusCode: 401,
      message: 'User not authorized to use this wallet.',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'The asset symbol is not exists or the wallet is not exists.',
    example: {
      statusCode: 404,
      message: 'The asset symbol is not exists.',
    },
  })
  @Post()
  async createOrder(@Body() body: CreateOrderDTO, @Request() req) {
    const { walletID, asset, orderType, price, quantity } = body;

    const wallet = await this.wallet.getUniqueById({ id: walletID })
    if (!wallet) {
      throw new AppError('The wallet is not exists.', 404);
    }

    if (wallet.userID !== req.user.id) {
      throw new AppError('User not authorized to use this wallet.', 401);
    }

    const assetSimbol = await this.asset.getAssetsBySymbol(asset);
    if (!assetSimbol) {
      throw new AppError('The asset symbol is not exists.', 404);
    }

    const orderNumber = '1';

    const order = {
      orderNumber,
      asset: { connect: { id: assetSimbol.id } },
      priceExec: 0,
      quantityExec: 0,
      status: OrderStatus.OPEN,
      wallet: { connect: { id: wallet.id } },
      orderType,
      priceOrder: price,
      quantityOrder: quantity,
      user: { connect: { id: req.user.id } }
    }

    const newOrder = await this.order.create(order);

    return newOrder
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Request() req) {
    if (!id) {
      throw new AppError('ID is required and must be provided.', 400);
    }

    const order = await this.order.findById(id);
    if (!order) {
      throw new AppError('Order not found.', 404);
    }

    if (order.userId !== req.user.id) {
      throw new AppError('You do not have permission to access this order.', 401);
    }

    if (order.status === OrderStatus.EXECUTED) {
      throw new AppError('Order has already been executed.', 401);
    }

    const orderCancel = await this.order.cancelOrder(id);

    return orderCancel
  }

}
