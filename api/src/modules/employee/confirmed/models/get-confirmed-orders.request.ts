import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { PaginationRequest } from "@pawfect/models";


export class GetConfirmedOrdersRequest extends PaginationRequest {
  @Type(() => Number)
  @IsNumber()
  date!: number;
}
