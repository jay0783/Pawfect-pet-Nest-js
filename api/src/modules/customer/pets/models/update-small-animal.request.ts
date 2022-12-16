import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PetGenderEnum } from '@pawfect/db/entities/enums';
import { VeterinarianRequest } from '@pawfect/models';
import { Type } from 'class-transformer';

export class UpdateSmallAnimalRequest {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetGenderEnum)
  gender!: PetGenderEnum;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  breed?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  medicalNotes?: string;

  @IsOptional()
  @Type((type) => VeterinarianRequest)
  @IsArray()
  @ValidateNested({ each: true })
  veterinarians: Array<VeterinarianRequest> = new Array<VeterinarianRequest>();
}
