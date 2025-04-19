import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppError } from '@src/utils/app.erro';
import { PasswordHash } from '@src/utils/password.hash';
import { UserRepository } from '../user/user.repository';
import { SingInDTO } from './singin.Dto';

const UnauthorizedUser = 'Unauthorized user.';
const AccountInactive =
  UnauthorizedUser + ' Your account is currently inactive.';

@ApiTags('Authentication')
@Controller('singin')
export class SingInController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private jwtService: JwtService,
  ) { }

  @ApiOperation({
    summary: 'User Sign-In',
    description: 'Authenticate user and return JWT token.'
  })
  @ApiBody({ type: SingInDTO })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully.',
    schema: {
      example: {
        id: 'cuid-user-456',
        name: 'John Doe',
        email: 'johndoe@example.com',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized user or inactive account.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized user.',
      },
    },
  })
  @Post()
  async postSingIn(@Body() body: SingInDTO) {
    const { email, password } = body;

    const user = await this.user.findByEmail({ email });
    if (!user) {
      throw new AppError(UnauthorizedUser, 401);
    }

    if (!user.active) {
      throw new AppError(AccountInactive, 401);
    }

    const validPassword = await this.hash.compareHash(password, user.password);
    if (!validPassword) {
      throw new AppError(UnauthorizedUser, 401);
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      wallet: user.activeWalletId,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
