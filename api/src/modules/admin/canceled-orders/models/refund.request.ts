import { IsNotEmpty } from 'class-validator';
import { IsAppName, IsAppPhoneNumber } from '@pawfect/validators';
import { ApiProperty } from '@nestjs/swagger';

export class RefundRequest {
  @ApiProperty()
  @IsNotEmpty()
  type!: number;

  @ApiProperty()
  @IsNotEmpty()
  amount!: number;
}
