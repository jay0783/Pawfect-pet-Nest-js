import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetOrderMapRequest {
  @Type(() => Number)
  @IsNumber()
  startedDate!: number;

  @Type(() => Number)
  @IsNumber()
  endedDate!: number;
}
