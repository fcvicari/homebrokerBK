import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { UserRepository } from '@src/users/user/user.repository';
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

    private user: UserRepository,
  ) { }

  @ApiOperation({ summary: 'Create wallet' })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully.',
    schema: {
      example: {
        id: "cuid-wallet-123",
        name: "My wallet",
        userID: "cuid-user-456",
        balance: 0,
        amount: 0,
        dividends: 0,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      },
    },
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
          id: req.user.id,
        },
      },
    });

    await this.user.update({
      where: { id: req.user.id },
      data: {
        activeWallet: {connect: { id: wallet.id }},
        updatedAt: new Date(),
      },
    });

    return { ...wallet };
  }

  @ApiOperation({ summary: 'Get all wallet to the user' })
  @ApiResponse({
    status: 200,
    description: 'List of wallets for the authenticated user.',
    schema: {
      example: [{
        id: "cuid-wallet-123",
        name: "My wallet",
        userID: "cuid-user-456",
        balance: 0,
        amount: 0,
        dividends: 0,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      }],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request.',
  })
  @Get()
  async getWallets(@Request() req) {

    const wallets = await this.wallet.getWalletsByUser(req.user.id);

    return wallets;
  }


  @ApiOperation({ summary: 'Get a specific wallet' })
  @ApiResponse({
    status: 200,
    description: 'Get a specific wallet for the authenticated user.',
    schema: {
      example: {
        id: "cuid-wallet-123",
        name: "My wallet",
        userID: "cuid-user-456",
        balance: 0,
        amount: 0,
        dividends: 0,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found.',
    example: {
      statusCode: 404,
      message: 'Wallet not found.'
    }
  })
  @ApiResponse({
    status: 401,
    description: 'You do not have permission to access this wallet.',
    example: {
      statusCode: 401,
      message: 'You do not have permission to access this wallet.'
    }
  })
  @Get(':id')
  async getWallet(@Param('id') id: string, @Request() req) {
    const wallet = await this.wallet.getUniqueById({ id });
    if (!wallet) {
      throw new AppError('Wallet not found.', 404);
    }

    if (wallet.userID !== req.user.id) {
      throw new AppError('You do not have permission to access this wallet.', 401);
    }

    return wallet;
  }


  @ApiOperation({ summary: 'Delete wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet deleted successfully.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Wallet deleted successfully.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'You do not have permission to access this wallet.',
    schema: {
      example: {
        statusCode: 401,
        message: 'You do not have permission to access this wallet.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Wallet not found.',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const wallet = await this.wallet.getUniqueById({ id });
    if (!wallet) {
      throw new AppError('Wallet not found.', 404);
    }

    if (wallet.userID !== req.user.id) {
      throw new AppError('You do not have permission to access this wallet.', 401);
    }

    await this.wallet.delete({
      id,
    });

    return true;
  }
}
