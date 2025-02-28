import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class WalletAssetDTO {
  @ApiProperty({
    description: 'Unique identifier for the WalletAsset entry',
    example: 'cuid12345'
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Wallet ID',
    example: 'cuid-wallet-123'
  })
  @IsUUID()
  walletID: string;

  @ApiProperty({ description: 'Asset ID', example: 'cuid-asset-456' })
  @IsUUID()
  assetID: string;

  @ApiProperty({
    description: 'Quantity of the asset in the wallet',
    example: 10
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Average purchase price of the asset in the wallet',
    example: 150.75
  })
  @IsNumber()
  @Min(0)
  avgPrice: number;

  @ApiProperty({
    description: 'Total amount invested in the wallet',
    example: 5000.75
  })
  @IsNumber()
  @Min(0)
  amount: number;

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
