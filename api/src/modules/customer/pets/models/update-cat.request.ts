import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PetCharacterEnum, PetGenderEnum } from '@pawfect/db/entities/enums';
import { IsAppVeterinarianMany } from '@pawfect/validators';
import { VeterinarianModel, VeterinarianRequest } from '@pawfect/models';
import { Type } from 'class-transformer';

export class UpdateCatRequest {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetGenderEnum)
  gender!: PetGenderEnum;

  // @IsOptional()
  @IsNotEmpty()
  dob!: number;

  @IsOptional()
  // @IsNotEmpty()
  age!: number;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  breed?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  feedingInstructions?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  medicationInstructions?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsBoolean()
  isSpayed?: boolean;

  @IsOptional()
  // @IsNotEmpty()
  @IsBoolean()
  hasMedication?: boolean;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  medicalRequirements?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  medicalNotes?: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  locationOfLitterbox?: string;

  @IsOptional()
  @Type((type) => VeterinarianRequest)
  @IsArray()
  @ValidateNested({ each: true })
  veterinarians: Array<VeterinarianRequest> = new Array<VeterinarianRequest>();

  @IsOptional()
  // @IsNotEmpty()
  @IsEnum(PetCharacterEnum)
  character?: PetCharacterEnum;
}
