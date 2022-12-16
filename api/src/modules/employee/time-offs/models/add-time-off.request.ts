import {
  IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength
} from "class-validator";

import { TimeOffDateTypeEnum, TimeOffEnum } from '@pawfect/db/entities/enums';
import { IsAppNotEmptyArray, IsAppTimestampMany } from '@pawfect/validators';


export class AddTimeOffRequest {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TimeOffDateTypeEnum)
  readonly dateChoiceType!: TimeOffDateTypeEnum;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TimeOffEnum)
  readonly timeOffType!: TimeOffEnum;

  @IsAppNotEmptyArray()
  @IsPositive({ each: true })

  @IsAppTimestampMany()
  readonly dates!: Array<number>;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly notes?: string;
}
