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
import {
  PetCharacterEnum,
  PetGenderEnum,
  PetSizeEnum,
  PetSpeciesEnum,
} from '@pawfect/db/entities/enums';
import { IsAppVeterinarianMany } from '@pawfect/validators';
import { VeterinarianModel, VeterinarianRequest } from '@pawfect/models';
import { Type } from 'class-transformer';

export class AddDogRequest {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetSpeciesEnum)
  @IsIn([PetSpeciesEnum.DOG])
  speciesType!: PetSpeciesEnum;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetGenderEnum)
  gender!: PetGenderEnum;

  @IsNotEmpty()
  dob!: number;

  @IsOptional()
  // @IsNotEmpty()
  age!: number;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  breed?: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  size!: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetSizeEnum)
  sizeType!: PetSizeEnum;

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
  @IsArray()
  @IsString({ each: true })
  onWalksActions: Array<string> = new Array<string>();

  @IsOptional()
  // @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  onSomeoneEntryActions: Array<string> = new Array<string>();

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
  @IsBoolean()
  isDoggyDoorExists?: boolean;

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
