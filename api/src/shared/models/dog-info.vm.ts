import { DogInfoEntity } from '@pawfect/db/entities';
import { PetCharacterEnum, PetSizeEnum } from '@pawfect/db/entities/enums';

export interface DogInfoViewModel {
  age?: number;
  size?: number;
  sizeType?: PetSizeEnum;
  feedingInstructions?: string | null;
  onWalks?: string[];
  onSomeoneEntry?: string[];
  medicationInstructions?: string | null;
  isSprayed?: boolean | null;
  hasMedication?: boolean | null;
  isDoggyDoorExists?: boolean | null;
  character?: PetCharacterEnum | null;
  dob?: number;
}

export function getDogInfoForResponse(
  dogEntity: DogInfoEntity,
): DogInfoViewModel {
  return {
    age: dogEntity.age,
    size: dogEntity.size,
    sizeType: dogEntity.sizeType,
    feedingInstructions: dogEntity.feedingInstructions,
    onWalks: dogEntity.onWalksActions,
    onSomeoneEntry: dogEntity.onSomeoneEntryActions,
    medicationInstructions: dogEntity.medicationInstructions,
    isSprayed: dogEntity.isSpayed,
    hasMedication: dogEntity.hasMedication,
    isDoggyDoorExists: dogEntity.isDoggyDoorExists,
    character: dogEntity.character,
    dob: dogEntity.dob.getTime(),
  };
}
