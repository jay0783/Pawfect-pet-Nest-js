import { DateTime } from 'luxon';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsNumber,
} from 'class-validator';

import { VisitModel } from '@pawfect/models';
import { IsAppNotEmptyArray, IsAppVisitMany } from '@pawfect/validators';
import { MainOrderVisitEnum } from '@pawfect/db/entities/enums';
import Decimal from 'decimal.js';

export class CreateFirstOrderRequest {
  @IsNotEmpty()
  @IsUUID()
  readonly extraIds!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly date!: number;

  //   @IsOptional()
  //   @IsNotEmpty()
  //   readonly comment?: string;
}
