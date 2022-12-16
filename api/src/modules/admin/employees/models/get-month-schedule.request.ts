import { Type } from "class-transformer";
import { IsNumber } from "class-validator";


export class GetMonthScheduleRequest {
  @Type(() => Number)
  @IsNumber()
  dateFrom!: number;

  @Type(() => Number)
  @IsNumber()
  dateTo!: number;
}
