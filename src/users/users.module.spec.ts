import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/database/prisma.service';
import { UserController } from '@src/users/user/user.controller';
import { UserRepository } from '@src/users/user/user.repository';
import { UsersModule } from '@src/users/users.module';
import { UserTokenRepository } from '@src/users/usertoken/userToken.repository';
import { PasswordHash } from '@src/utils/password.hash';
import { SingInController } from './singin/singin.controller';
import { SingupController } from './singup/singup.controller';

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

  it('should register SingInController controller', () => {
    const singincontroller = moduleRef.get<SingInController>(SingInController);
    expect(singincontroller).toBeDefined();
  });

  it('should register SingUpController controller', () => {
    const singupcontroller = moduleRef.get<SingupController>(SingupController);
    expect(singupcontroller).toBeDefined();
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
