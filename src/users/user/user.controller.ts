import { Body, Controller, Delete, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/auth.guard';
import { AppError } from '@src/utils/app.erro';
import { PasswordHash } from '@src/utils/password.hash';
import { UserPasswordDTO } from './user.password.Dto';
import { UserRepository } from './user.repository';
import { UserDataDTO } from './userData.Dto';

const UserNotFound = 'User not found.';
const UserInactive = 'Inactive user.';
const InvalidPassword = 'The current password is not valid.';
const ChangePassword =
  'The current password and the new password cannot be the same.';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,
  ) { }

  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique user identifier'
  })
  @ApiOperation({
    summary: 'Update User Profile',
    description: 'Allow users to update their profile information such as email, name, and avatar.'
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    schema: {
      example: {
        id: 'cuid-user-456',
        name: 'John Doe',
        email: 'newemail@example.com',
        avatar: 'https://new-avatar-url.com/avatar.png',
        updatedAt: '2025-02-25T15:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 400,
        message: 'User not found.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User inactive.',
    schema: {
      example: {
        statusCode: 401,
        message: 'User inactive.',
      },
    },
  })
  @Patch(':id')
  async update(@Body() body: UserDataDTO, @Param('id') id: string) {
    const { email, name, avatar } = body;

    const userExists = await this.user.getUniqueById({ id });
    if (!userExists) {
      throw new AppError(UserNotFound, 400);
    }

    if (!userExists.active) {
      throw new AppError(UserInactive, 401);
    }

    userExists.avatar = avatar || null;
    userExists.name = name;
    userExists.email = email;
    userExists.updatedAt = new Date();

    const userUpdated = await this.user.update({
      where: { id },
      data: userExists,
    });

    return {
      ...userUpdated,
      password: undefined,
    };
  }

  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Change User Password',
    description: 'Allow users to change their password by providing the current and new password.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique user identifier'
  })
  @ApiResponse({
    status: 200,
    description: 'Password Changed Successfully',
    schema: {
      example: {
        id: "cuid-user-456",
        name: "John Doe",
        email: "johndoe@example.com",
        updatedAt: "2025-02-25T15:30:00.000Z"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 400,
        message: 'User not found.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User inactive or invalid current password.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Inactive user',
      },
    },
  })
  @Put(':id')
  async changePassword(
    @Body() body: UserPasswordDTO,
    @Param('id') id: string,
  ) {
    const { password, newPassword } = body;

    const userExists = await this.user.getUniqueById({ id });
    if (!userExists) {
      throw new AppError(UserNotFound, 400);
    }

    if (!userExists.active) {
      throw new AppError(UserInactive, 401);
    }

    if (password === newPassword) {
      throw new AppError(ChangePassword, 401);
    }

    const validPassword = await this.hash.compareHash(
      password,
      userExists.password,
    );
    if (!validPassword) {
      throw new AppError(InvalidPassword, 401);
    }

    userExists.password = await this.hash.generateHash(newPassword);
    userExists.updatedAt = new Date();

    const userUpdated = await this.user.update({
      where: { id },
      data: userExists,
    });

    return {
      ...userUpdated,
      password: undefined,
    };
  }

  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Delete user',
    description: "This endpoint allows you to delete a user by their unique id. It first checks if the user exists, and if so, deletes the user. If the user does not exist, it returns an error."
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.'
  })
  @ApiResponse({
    status: 400,
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 400,
        message: 'User not found.',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const userExists = await this.user.getUniqueById({ id });
    if (!userExists) {
      throw new AppError(UserNotFound, 400);
    }

    await this.user.delete({
      id,
    });

    return true;
  }
}
