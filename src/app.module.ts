import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './database/prisma.service';
import { UserController } from './users/user/user.controller';
import { UserRepository } from './users/user/user.repository';
import { UserTokenRepository } from './users/usertoken/userToken.repository';
import { PasswordHash } from './utils/password.hash';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UserController],
  providers: [PasswordHash, PrismaService, UserRepository, UserTokenRepository],
})

export class AppModule { }
