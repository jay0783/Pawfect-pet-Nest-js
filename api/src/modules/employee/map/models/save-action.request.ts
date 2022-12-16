import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { GeoPositionModel } from "@pawfect/models";


export class SaveActionRequest implements GeoPositionModel {
  @IsNumber()
  lat!: number;

  @IsNumber()
  long!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  createdAt!: number;

  @IsNotEmpty()
  orderCheckId!: string;
}
