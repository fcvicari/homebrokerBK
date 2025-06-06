import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@src/database/prisma.service';
import { UserController } from '@src/users/user/user.controller';
import { UserRepository } from '@src/users/user/user.repository';
import { UserTokenRepository } from '@src/users/usertoken/userToken.repository';
import { PasswordHash } from '@src/utils/password.hash';
import { WalletRepository } from '@src/wallets/wallet/wallet.repository';
import { SingInController } from './singin/singin.controller';
import { SingupController } from './singup/singup.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UserController, SingInController, SingupController],
  providers: [PasswordHash, PrismaService, UserRepository, UserTokenRepository, WalletRepository],
})

export class UsersModule { }
