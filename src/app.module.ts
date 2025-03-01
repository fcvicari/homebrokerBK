import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AssetsModule } from '@src/assets/assets.module';
import { PrismaService } from '@src/database/prisma.service';
import { OrdersModule } from '@src/orders/orders.module';
import { UsersModule } from '@src/users/users.module';
import { WalletsModule } from '@src/wallets/wallets.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    UsersModule,
    WalletsModule,
    AssetsModule,
    OrdersModule
  ],
  providers: [PrismaService]
})

export class AppModule { }
