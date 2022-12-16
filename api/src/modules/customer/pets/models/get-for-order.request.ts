import { IsNotEmpty, IsString, IsUUID } from "class-validator";

import { IsAppNotEmptyArray, IsAppVisitMany } from "@pawfect/validators";

import { VisitModel } from "@pawfect/models";


export class GetForOrderRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  serviceId!: string;

  @IsAppNotEmptyArray()
  onDates!: Array<number>;

  @IsAppVisitMany()
  visits!: Array<VisitModel>;
}
