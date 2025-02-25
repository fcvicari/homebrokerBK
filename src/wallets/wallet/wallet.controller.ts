import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { WalletDTO } from './wallet.Dto';
import { WalletRepository } from './wallet.repository';

@ApiTags('Wallet')
@ApiBearerAuth('jwt')
@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private wallet: WalletRepository,
  ) { }

  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully.',
    type: WalletDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request.',
  })
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

  @ApiResponse({
    status: 200,
    description: 'List of wallets for the authenticated user.',
    type: [WalletDTO],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request.',
  })
  @Get()
  async getWallets(@Request() req) {

    const wallets = await this.wallet.getWalletsByUser(req.user.Id);

    return wallets;
  }

  @ApiResponse({
    status: 200,
    description: 'Wallet deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found.',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const wallet = await this.wallet.getUniqueById({ id });
    if (!wallet) {
      throw new AppError('Wallet not found.', 404);
    }

    await this.wallet.delete({
      id,
    });

    return true;
  }
}
