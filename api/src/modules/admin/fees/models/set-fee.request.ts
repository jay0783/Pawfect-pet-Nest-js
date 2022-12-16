import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SetFeeRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount!: number;
}
