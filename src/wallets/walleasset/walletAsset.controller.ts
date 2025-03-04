import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { WalletRepository } from '../wallet/wallet.repository';
import { WalletAssetDTO } from './walletAsset.Dto';
import { WalletAssetRepository } from './walletAsset.repository';

@ApiTags('Wallet')
@ApiBearerAuth('jwt')
@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletAssetController {
  constructor(
    private wallet: WalletRepository,

    private walletasset: WalletAssetRepository,
  ) { }

  @ApiOperation({ summary: 'Include asset into wallet' })
  @ApiResponse({
    status: 201,
    description: 'Asset successfully purchased and added to your wallet!',
    schema: {
      example: {
        id: "cuid-asset-wallet-123",
        walletID: "cuid-wallet-456",
        assetID: "cuid-asset-789",
        quantity: 10,
        avgPrice: 150.75,
        amount: 5000.75,
        createdAt: "2025-03-03T22:08:36.915Z",
        updatedAt: "2025-03-03T22:08:36.915Z"
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Wallet not found or you do not have permission to access this wallet.',
    example: {
      statusCode: 401,
      message: 'Wallet not found.'
    }
  })
  @Post('/asset')
  async post(@Body() body: WalletAssetDTO, @Request() req) {
    const { assetID, amount, avgPrice, quantity, walletID } = body;

    const walletUser = await this.wallet.getUniqueById({ id: walletID });
    if (!walletUser) {
      throw new AppError('Wallet not found.', 401);
    }

    if (walletUser.userID !== req.user.id) {
      throw new AppError('You do not have permission to access this wallet.', 401);
    }

    const asset = await this.walletasset.findAssetWallet(walletID, assetID);
    const id = asset?.id;

    if (!id) {
      const walletasset = await this.walletasset.create({
        asset: {
          connect: { id: assetID },
        },
        wallet: {
          connect: { id: walletID },
        },
        amount,
        quantity,
        avgPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { ...walletasset };
    } else {
      const walletasset = await this.walletasset.update(id, {
        amount,
        quantity,
        avgPrice,
        updatedAt: new Date(),
      });

      return { ...walletasset };
    }
  }
}
