import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class AssetsDTO {
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
}
