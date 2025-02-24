import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { WalletDTO } from './wallet.Dto';
import { WalletRepository } from './wallet.repository';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private wallet: WalletRepository,
  ) { }

  @Post()
  async post(@Body() body: WalletDTO, @Request() req) {
    const { name } = body;

    const wallet = await this.wallet.create({
      name,
      balance: 0,
      amount: 0,
      dividends: 0,
      user: {
        connect: {
          id: req.user.Id,
        },
      },
    });

    return { ...wallet };
  }

  @Get()
  async getWallets(@Request() req) {

    const wallets = await this.wallet.getWalletsByUser(req.user.Id);

    return wallets;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const wallet = await this.wallet.getUniqueById({ id });
    if (!wallet) {
      throw new AppError('Wallet not found.', 400);
    }

    await this.wallet.delete({
      id,
    });

    return true;
  }
}
