import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsAppVeterinarianMany } from '@pawfect/validators';
import { VeterinarianModel, VeterinarianRequest } from '@pawfect/models';
import { Type } from 'class-transformer';

export class AddCardRequest {
  @IsNotEmpty()
  @IsString()
  number!: string;

  @IsNotEmpty()
  @IsNumber()
  exp_month!: number;

  @IsNotEmpty()
  @IsNumber()
  exp_year!: number;

  @IsNotEmpty()
  @IsString()
  cvc!: string;
}
