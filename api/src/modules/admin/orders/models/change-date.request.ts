import { ApiProperty } from '@nestjs/swagger';
import { MAX_TIME_MILLIS, MIN_TIME_MILLIS } from '@pawfect/constants';
import { IsAppTimestamp } from '@pawfect/validators';
import { IsNumber, Max, Min } from 'class-validator';

export class ChangeDateRequest {
  @ApiProperty()
  @IsNumber()
  @IsAppTimestamp()
  readonly date!: number;

  @ApiProperty()
  @IsNumber()
  @Min(MIN_TIME_MILLIS)
  @Max(MAX_TIME_MILLIS)
  readonly time!: number;
}
