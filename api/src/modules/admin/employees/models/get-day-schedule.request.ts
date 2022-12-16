import { Type } from "class-transformer";
import { IsNumber } from "class-validator";


export class GetDayScheduleRequest {
  @Type(() => Number)
  @IsNumber()
  date!: number;
}
