import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export interface ExtraServiceRequestModel {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export class AddExtraServiceRequest implements ExtraServiceRequestModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  //   @MaxLength(25)
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
