import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@src/database/prisma.service';
import { UserRepository } from '@src/users/user/user.repository';
import { AssetController } from './asset/asset.controller';
import { AssetRepository } from './asset/asset.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AssetController],
  providers: [PrismaService, UserRepository, AssetRepository],
})

export class AssetsModule { }
