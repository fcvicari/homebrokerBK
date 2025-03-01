import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDTO {
  @ApiProperty({
    description: 'Number order',
    example: '1234567'
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Wallet ID',
    example: 'cuid-wallet-123'
  })
  @IsString()
  walletID: string;

  @ApiProperty({
    description: 'Asset symbol',
    example: 'BTC'
  })
  @IsString()
  asset: string;

  @ApiProperty({
    description: 'Order type',
    example: {
      enum: [
        'BUY',
        'SELL'
      ]
    }
  })
  orderType: 'BUY' | 'SELL';

  @ApiProperty({
    description: 'Quantity of the asset in the order',
    example: 10
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Price of the asset in the order',
    type: Number,
    required: false,
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

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
