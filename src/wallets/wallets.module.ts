import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@src/database/prisma.service';
import { UserRepository } from '@src/users/user/user.repository';
import { WalletAssetController } from './walleasset/walletAsset.controller';
import { WalletAssetRepository } from './walleasset/walletAsset.repository';
import { WalletController } from './wallet/wallet.controller';
import { WalletRepository } from './wallet/wallet.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [WalletController, WalletAssetController],
  providers: [PrismaService, UserRepository, WalletRepository, WalletAssetRepository],
})

export class WalletsModule { }
