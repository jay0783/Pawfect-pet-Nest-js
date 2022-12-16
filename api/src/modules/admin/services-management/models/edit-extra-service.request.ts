import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ExtraServiceRequestModel } from './add-extra-service.request';

export class EditExtraServiceRequest implements ExtraServiceRequestModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
