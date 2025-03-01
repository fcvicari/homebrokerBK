import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/database/prisma.service';
import { UserRepository } from '@src/users/user/user.repository';
import { WalletAssetController } from './walleasset/walletAsset.controller';
import { WalletAssetRepository } from './walleasset/walletAsset.repository';
import { WalletController } from './wallet/wallet.controller';
import { WalletRepository } from './wallet/wallet.repository';
import { WalletsModule } from './wallets.module';

describe('UsersModule Test', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '12h' },
        }),
        WalletsModule
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should register WalletController controller', () => {
    const walletController = moduleRef.get<WalletController>(WalletController);
    expect(walletController).toBeDefined();
  });

  it('should register WalletAssetController controller', () => {
    const walletAssetController = moduleRef.get<WalletAssetController>(WalletAssetController);
    expect(walletAssetController).toBeDefined();
  });

  it('should register PrismaService provider', () => {
    const prismaService = moduleRef.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should register UserRepository provider', () => {
    const userRepository = moduleRef.get<UserRepository>(UserRepository);
    expect(userRepository).toBeDefined();
  });

  it('should register WalletRepository provider', () => {
    const walletRepository = moduleRef.get<WalletRepository>(WalletRepository);
    expect(walletRepository).toBeDefined();
  });

  it('should register WalletAssetRepository provider', () => {
    const walletAssetRepository = moduleRef.get<WalletAssetRepository>(WalletAssetRepository);
    expect(walletAssetRepository).toBeDefined();
  });
});
