import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { IsAppNotEmptyArray, IsAppServiceChecklist } from '@pawfect/validators';
import { PetSpeciesEnum } from '@pawfect/db/entities/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  readonly title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly type!: number;

  @ApiProperty()
  @IsArray()
  // @IsAppNotEmptyArray()
  @IsEnum(PetSpeciesEnum, { each: true })
  readonly forSpeciesTypes: PetSpeciesEnum[] = [];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly description!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  readonly deleteChecklistIds: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly duration!: number;
}
