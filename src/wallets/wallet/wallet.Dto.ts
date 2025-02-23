import { IsNotEmpty } from 'class-validator';

export class WalletDTO {
  @IsNotEmpty({ message: 'Name is mandatory.' })
  walletname: string;
}
