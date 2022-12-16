import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { CustomerTransactionEnum } from '@pawfect/db/entities/enums';

export class createTransactionRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount!: number;

  @IsNotEmpty()
  @IsEnum(CustomerTransactionEnum)
  readonly hearAboutUs!: CustomerTransactionEnum;

  @IsNotEmpty()
  @IsUUID()
  readonly bankcardId!: string;

  @IsNotEmpty()
  @IsUUID()
  readonly customerId!: string;
}
