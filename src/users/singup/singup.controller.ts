import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from '@src/users/user/user.Dto';
import { UserRepository } from '@src/users/user/user.repository';
import { UserTokenRepository } from '@src/users/usertoken/userToken.repository';
import { AppError } from '@src/utils/app.erro';
import { PasswordHash } from '@src/utils/password.hash';
import { differenceInHours } from 'date-fns';
import { AlterPasswordDTO, RecoveryPasswordDTO } from './singup.Dto';

@ApiTags('User')
@Controller()
export class SingupController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private userToken: UserTokenRepository,
  ) { }

  @ApiOperation({
    summary: 'Creates a new user account',
    description: 'Creates a new user account with an inactive status and generates an activation token.'
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    example: {
      id: "cuid-user-456",
      name: "John Doe",
      email: "johndoe@example.com",
      avatar: "https://example.com/avatar.jpg",
      active: false,
      createdAt: "2025-02-25T01:25:13.248Z",
      updatedAt: "2025-02-25T01:25:13.248Z",
      activeToken: "active-token",
    }
  })
  @ApiResponse({ status: 400, description: 'This email is already used by another user.' })
  @Post('singup')
  async postNewUser(@Body() body: UserDTO) {
    const { email, name, password, avatar } = body;

    const userExists = await this.user.findByEmail({ email });
    if (userExists) {
      throw new AppError('This email is already used by another user.', 400);
    }

    const hasPassword = await this.hash.generateHash(password);

    const userCreated = await this.user.create({
      name,
      email,
      password: hasPassword,
      avatar,
      active: false,
    });

    const token = await this.userToken.create({
      user: { connect: { id: userCreated.id } },
    });

    return {
      ...userCreated,
      password: undefined,
      activeToken: token.id,
    };
  }

  @ApiOperation({
    summary: 'Activate a user account',
    description: 'This API endpoint is used to activate a user account using an activation token. It validates the token, checks its expiration (valid for 2 hours), activates the user account if valid, and removes all related activation tokens after successful activation.'
  })
  @ApiQuery({
    name: 'token',
    required: true
  })
  @ApiResponse({
    status: 201,
    description: 'User activate successfully.',
    example: {
      id: "cuid-user-456",
      name: "John Doe",
      email: "johndoe@example.com",
      avatar: "https://example.com/avatar.jpg",
      active: true,
      createdAt: "2025-02-25T01:25:13.248Z",
      updatedAt: "2025-02-25T01:25:13.248Z",
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Token expired.'
  })
  @Post('activate')
  async postActivateUser(@Query() query) {
    const { token } = query;

    const userToken = await this.userToken.findById({ id: token });
    if (userToken) {
      if (differenceInHours(Date.now(), userToken.createdAt) > 2) {
        throw new AppError('Token expired.', 400);
      }

      const user = await this.user.activateUser(userToken.userID);

      await this.userToken.deleteAll({
        userID: userToken.userID,
      });

      return { ...user, password: undefined };
    }

    return null;
  }

  @ApiOperation({
    summary: 'Reset password',
    description: "This API endpoint allows users to reset their password using a valid token. It validates the token, ensures it hasn't expired(valid for 2 hours), securely hashes the new password, updates the user's password, and deletes all related tokens after a successful update."
  })
  @ApiQuery({ name: 'token', required: true })
  @ApiResponse({
    status: 201,
    description: 'User activate successfully.',
    example: {
      id: "cuid-user-456",
      name: "John Doe",
      email: "johndoe@example.com",
      avatar: "https://example.com/avatar.jpg",
      active: true,
      createdAt: "2025-02-25T01:25:13.248Z",
      updatedAt: "2025-02-25T01:25:13.248Z",
    }
  })
  @ApiResponse({ status: 400, description: 'Token expired.' })
  @Post('alterpass')
  async postAlterPassword(@Body() body: AlterPasswordDTO, @Query() query) {
    const { token } = query;
    const { password } = body;

    const userToken = await this.userToken.findById({ id: token });
    if (userToken) {
      if (differenceInHours(Date.now(), userToken.createdAt) > 2) {
        throw new AppError('Token expired.', 400);
      }

      const newPassword = await this.hash.generateHash(password);

      const user = await this.user.alterPassword(userToken.userID, newPassword);

      await this.userToken.deleteAll({
        userID: userToken.userID,
      });

      return { ...user, password: undefined };
    }

    return null;
  }

  @ApiOperation({
    summary: 'Password recovery process',
    description: "This API initiates the password recovery process. It checks if the provided email belongs to a registered user, generates a password reset token, deletes any existing tokens for security, and (optionally) sends a recovery email containing the new token."
  })
  @ApiResponse({
    status: 201, description: 'Token alter password send.', example: {
      token: "active-token",
    }
  })
  @Post('recoverpass')
  async postRecoverPassword(@Body() body: RecoveryPasswordDTO) {
    const { email } = body;

    const userExists = await this.user.findByEmail({ email });
    if (userExists) {
      await this.userToken.deleteAll({
        userID: userExists.id,
      });

      const userToken = await this.userToken.create({
        user: {
          connect: { id: userExists.id },
        },
      });

      //sendEmailActivate(userToken.id);
      return { token: userToken.id };
    }

    return null;
  }
}
