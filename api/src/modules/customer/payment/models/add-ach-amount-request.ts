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

export class AddAchAmountRequest {
  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsNotEmpty()
  @IsString()
  routingNumber!: string;

  @IsNotEmpty()
  @IsString()
  accountNumber!: string;

  @IsNotEmpty()
  @IsNumber()
  total!: number;

  //   @IsNotEmpty()
  //   @IsString()
  //   token!: string;

  @IsNotEmpty()
  @IsString()
  first!: string;

  @IsNotEmpty()
  @IsString()
  middle!: string;

  @IsNotEmpty()
  @IsString()
  last!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}
