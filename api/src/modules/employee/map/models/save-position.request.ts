import { GeoPositionModel } from "@pawfect/models";
import { IsAppNotEmptyArray } from "@pawfect/validators";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";


export class SavePositionRequest {
  @IsAppNotEmptyArray()
  @ValidateNested({ each: true })
  @Type(type => SavedGeoPosition)
  positions!: Array<SavedGeoPosition>;
}


export class SavedGeoPosition implements GeoPositionModel {
  @IsNotEmpty()
  @IsNumber()
  lat!: number;

  @IsNotEmpty()
  @IsNumber()
  long!: number;

  @IsNotEmpty()
  @IsNumber()
  createdAt!: number;
}
