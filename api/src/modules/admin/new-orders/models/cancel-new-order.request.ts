import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CancelNewOrderRequest {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly reason?: string;
}
