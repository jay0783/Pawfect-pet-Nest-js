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

export class AddCardAmountRequest {
  @IsNotEmpty()
  @IsNumber()
  total!: number;

  @IsNotEmpty()
  @IsString()
  token!: string;
}
