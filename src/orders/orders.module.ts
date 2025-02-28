import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AssetRepository } from '@src/assets/asset/asset.repository';
import { PrismaService } from '@src/database/prisma.service';
import { UserRepository } from '@src/users/user/user.repository';
import { WalletRepository } from '@src/wallets/wallet/wallet.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [],
  providers: [PrismaService, UserRepository, AssetRepository, WalletRepository],
})

export class OrdersModule { }
