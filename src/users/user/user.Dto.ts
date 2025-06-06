import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name is mandatory.' })
  name: string;

  @ApiProperty({
    description: 'User email address (must be unique and used for login).',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty({ message: 'Email is mandatory.' })
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters long and include uppercase, lowercase letters, and numbers.',
    example: 'Password123',
  })
  @IsNotEmpty({ message: 'Password is mandatory.' })
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain uppercase, lowercase letters and numbers.',
  })
  password: string;

  @ApiProperty({
    description: 'Optional avatar URL for the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}
