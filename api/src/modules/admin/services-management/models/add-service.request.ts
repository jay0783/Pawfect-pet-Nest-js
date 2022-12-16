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
import { SubcategoryEntity, CategoryEntity } from '@pawfect/db/entities';

export interface checklistRequest {
  name: string;
  duration: number;
}

export class AddServiceRequest {
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
  @IsAppNotEmptyArray()
  @IsEnum(PetSpeciesEnum, { each: true })
  readonly forSpeciesTypes: PetSpeciesEnum[] = [];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly description!: string;

  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsArray()
  readonly checklists: Array<checklistRequest>;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly duration!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly categoryId: CategoryEntity;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly subcategoryId: SubcategoryEntity;
}
