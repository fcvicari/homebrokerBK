import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class AssetsDTO {
  @ApiProperty({
    description: 'Unique identifier of the asset',
    type: String,
    required: false,
    example: null,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'The name of the asset',
    type: String,
    example: 'Bitcoin',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is mandatory.' })
  name: string;

  @ApiProperty({
    description: 'The symbol of the asset (e.g., BTC, ETH)',
    type: String,
    example: 'BTC',
  })
  @IsString()
  @IsNotEmpty({ message: 'Symbol is mandatory.' })
  symbol: string;

  @ApiProperty({
    description: 'URL to an image representing the asset',
    type: String,
    required: false,
    example: 'https://example.com/asset-image.png',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @ApiProperty({
    description: 'Price of the asset',
    type: Number,
    required: false,
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'The date and time when the asset was created',
    type: String,
    required: false,
    example: '2023-02-25T14:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    description: 'The date and time when the asset was last updated',
    type: String,
    required: false,
    example: '2023-02-25T14:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
