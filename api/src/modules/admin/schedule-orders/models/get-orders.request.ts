import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetOrderRequest {
  @Type(() => Number)
  @IsNumber()
  date!: number;
}
