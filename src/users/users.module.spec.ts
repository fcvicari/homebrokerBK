import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/database/prisma.service';
import { PasswordHash } from '@src/utils/password.hash';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UsersModule } from './users.module';
import { UserTokenRepository } from './usertoken/userToken.repository';

describe('UsersModule Test', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '12h' },
        }),
        UsersModule
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should register UserController controller', () => {
    const userController = moduleRef.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should register PrismaService provider', () => {
    const prismaService = moduleRef.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should register PasswordHash provider', () => {
    const passwordHash = moduleRef.get<PasswordHash>(PasswordHash);
    expect(passwordHash).toBeDefined();
  });

  it('should register UserRepository provider', () => {
    const userRepository = moduleRef.get<UserRepository>(UserRepository);
    expect(userRepository).toBeDefined();
  });

  it('should register UserTokenRepository provider', () => {
    const userTokenRepository = moduleRef.get<UserTokenRepository>(UserTokenRepository);
    expect(userTokenRepository).toBeDefined();
  });
});
