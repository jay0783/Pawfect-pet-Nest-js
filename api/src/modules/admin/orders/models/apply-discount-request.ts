import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyDiscountRequest {
  @IsNotEmpty()
  @IsNumber()
  discount!: number;
}
