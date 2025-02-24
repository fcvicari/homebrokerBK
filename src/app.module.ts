import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@src/database/prisma.service';
import { UsersModule } from '@src/users/users.module';
import { WalletsModule } from '@src/wallets/wallets.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    UsersModule,
    WalletsModule,
    AssetsModule
  ],
  providers: [PrismaService]
})

export class AppModule { }
