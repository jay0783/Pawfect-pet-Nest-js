import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class RateEmployeeRequest {
  @IsUUID()
  orderId!: string;

  @Min(0)
  @Max(5)
  @IsNumber()
  rating!: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment?: string;
}
