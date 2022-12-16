import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export interface bookingRestrictionRequestModel {
  id: string;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

export class BookingRestrictionRequest
  implements bookingRestrictionRequestModel {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNumber()
  months: number;

  @IsNumber()
  days: number;

  @IsNumber()
  hours: number;

  @IsNumber()
  minutes: number;
}

export class BookingRestrictionsRequest {
  @Type((type) => BookingRestrictionRequest)
  @IsArray()
  @ValidateNested({ each: true })
  restrictions: Array<BookingRestrictionRequest> = new Array<BookingRestrictionRequest>();
}
