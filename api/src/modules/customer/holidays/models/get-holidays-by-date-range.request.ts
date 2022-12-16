/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Validate } from "class-validator";


export class GetHolidaysByDateRangeRequest {
  @Transform((v) => (v === "0" ? 0 : parseInt(v, 10)))
  @IsNotEmpty()
  @IsNumber()
  dateFrom!: number;

  @Transform((v) => (v === "0" ? 0 : parseInt(v, 10)))
  @IsNotEmpty()
  @IsNumber()
  @Validate((value: number, object: any) => value > object.dateFrom)
  dateTo!: number;
}
