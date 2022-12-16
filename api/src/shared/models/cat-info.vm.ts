import { CatInfoEntity } from '@pawfect/db/entities';
import { PetCharacterEnum } from '@pawfect/db/entities/enums';

export interface CatInfoViewModel {
  age?: number;
  feedingInstructions?: string | null;
  medicationInstructions?: string | null;
  isSprayed?: boolean | null;
  hasMedication?: boolean | null;
  locationOfLitterbox?: string | null;
  character?: PetCharacterEnum | null;
  dob?: number;
}

export function getCatInfoForResponse(
  catEntity: CatInfoEntity,
): CatInfoViewModel {
  return {
    age: catEntity.age,
    feedingInstructions: catEntity.feedingInstructions,
    medicationInstructions: catEntity.medicationInstructions,
    isSprayed: catEntity.isSpayed,
    hasMedication: catEntity.hasMedication,
    locationOfLitterbox: catEntity.locationOfLitterbox,
    character: catEntity.character,
    dob: catEntity.dob.getTime(),
  };
}
