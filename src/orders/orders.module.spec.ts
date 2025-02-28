import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetRepository } from '@src/assets/asset/asset.repository';
import { PrismaService } from '@src/database/prisma.service';
import { UserRepository } from '@src/users/user/user.repository';
import { WalletRepository } from '@src/wallets/wallet/wallet.repository';
import { OrdersModule } from './orders.module';

describe('UsersModule Test', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '12h' },
        }),
        OrdersModule
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should register PrismaService provider', () => {
    const prismaService = moduleRef.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should register UserRepository provider', () => {
    const userRepository = moduleRef.get<UserRepository>(UserRepository);
    expect(userRepository).toBeDefined();
  });

  it('should register AssetRepository provider', () => {
    const assetRepository = moduleRef.get<AssetRepository>(AssetRepository);
    expect(assetRepository).toBeDefined();
  });

  it('should register WalletRepository provider', () => {
    const assetRepository = moduleRef.get<WalletRepository>(WalletRepository);
    expect(assetRepository).toBeDefined();
  });

});
