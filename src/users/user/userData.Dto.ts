import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDataDTO {
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
  @IsNotEmpty({ message: 'Email is mandatory.' })
  email: string;

  @ApiProperty({
    description: 'Optional avatar URL for the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}
