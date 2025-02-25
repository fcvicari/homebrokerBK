import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WalletDTO {
  @ApiProperty({
    description: 'Unique identifier of the wallet',
    type: String,
    required: false,
    example: null,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'The name of the wallet',
    type: String,
    example: 'Retirement Fund',
  })
  @IsNotEmpty({ message: 'Name is mandatory.' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The date when the wallet was created',
    type: String,
    required: false,
    example: '2023-01-01T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    description: 'The date when the wallet was last updated',
    type: String,
    required: false,
    example: '2023-02-25T14:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
