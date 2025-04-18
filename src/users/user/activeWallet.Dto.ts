import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActiveWalletDTO {
  @ApiProperty({
    description: 'Wallet ID of the user that will be activated.',
  })
  @IsNotEmpty({ message: 'Wallet ID is required.' })
  walletID: string;
}
