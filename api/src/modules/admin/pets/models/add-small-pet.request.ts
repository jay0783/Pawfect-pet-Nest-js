import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PetGenderEnum, PetSpeciesEnum } from '@pawfect/db/entities/enums';
import { VeterinarianModel, VeterinarianRequest } from '@pawfect/models';
import { IsAppVeterinarianMany } from '@pawfect/validators';
import { Type } from 'class-transformer';

export class AddSmallPetRequest {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PetSpeciesEnum)
  @IsIn([PetSpeciesEnum.SMALL_ANIMAL])
  speciesType!: PetSpeciesEnum;

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
