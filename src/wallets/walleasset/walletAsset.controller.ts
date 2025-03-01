import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @ApiResponse({
    status: 201,
    description: 'Asset successfully purchased and added to your wallet!',
    type: WalletAssetDTO,
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
    const { id, assetID, amount, avgPrice, quantity, walletID } = body;

    const walletUser = await this.wallet.getUniqueById({ id: walletID });
    if (!walletUser) {
      throw new AppError('Wallet not found.', 401);
    }

    if (walletUser.userID !== req.user.id) {
      throw new AppError('You do not have permission to access this wallet.', 401);
    }

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
