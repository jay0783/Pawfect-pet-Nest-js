import {
  IsArray,
  IsBoolean,
  IsDate,
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
import {
  PetCharacterEnum,
  PetGenderEnum,
  PetSpeciesEnum,
} from '@pawfect/db/entities/enums';
import { VeterinarianRequest } from '@pawfect/models';
import { Type } from 'class-transformer';

export class AddCatRequest {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetSpeciesEnum)
  @IsIn([PetSpeciesEnum.CAT])
  speciesType!: PetSpeciesEnum;

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
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  feedingInstructions?: string;

  @IsOptional()
  @IsString()
  medicationInstructions?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isSpayed?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  hasMedication?: boolean;

  @IsOptional()
  @IsString()
  medicalRequirements?: string;

  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @IsOptional()
  @IsString()
  locationOfLitterbox?: string;

  @IsOptional()
  @Type((type) => VeterinarianRequest)
  @IsArray()
  @ValidateNested({ each: true })
  veterinarians: Array<VeterinarianRequest> = new Array<VeterinarianRequest>();

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PetCharacterEnum)
  character?: PetCharacterEnum;
}
