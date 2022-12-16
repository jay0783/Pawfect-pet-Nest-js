import { ApiProperty } from '@nestjs/swagger';
import { MAX_TIME_MILLIS, MIN_TIME_MILLIS } from '@pawfect/constants';
import { IsAppTimestamp } from '@pawfect/validators';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CancelOrderRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment!: string;
}
