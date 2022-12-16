import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

import { IsAppTimestamp } from "@pawfect/validators";
import { PaginationRequest } from "@pawfect/models";


export class GetUpcomingOrdersRequest extends PaginationRequest {
  @Type(() => Number)
  @IsNumber()
  @IsAppTimestamp()
  date!: number;
}
