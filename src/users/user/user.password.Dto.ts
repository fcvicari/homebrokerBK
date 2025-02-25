import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserPasswordDTO {
  @ApiProperty({
    description: 'Current password',
    example: 'Password123',
  })
  @IsNotEmpty({ message: 'Enter the current password.' })
  password: string;

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
  newPassword: string;
}
