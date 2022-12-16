import { ApiProperty } from '@nestjs/swagger';
import { IsAppNotEmptyArray } from '@pawfect/validators';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class AddHolidayRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(31)
  day!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month!: number;
}
export class AddMultipleHolidayRequest {
  @ApiProperty()
  @Type((type) => AddHolidayRequest)
  @IsArray()
  @ValidateNested({ each: true })
  days: Array<AddHolidayRequest>;
}
