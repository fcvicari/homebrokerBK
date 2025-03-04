import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDTO {
  @ApiProperty({
    description: 'The name of the wallet',
    type: String,
    example: 'Retirement Fund',
  })
  @IsNotEmpty({ message: 'Name is mandatory.' })
  @IsString()
  name: string;
}
