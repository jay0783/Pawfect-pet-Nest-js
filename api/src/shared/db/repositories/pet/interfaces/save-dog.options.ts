import { PetCharacterEnum, PetSizeEnum } from '@pawfect/db/entities/enums';
import { DateTime } from 'aws-sdk/clients/devicefarm';

export interface SaveDogOptions {
  age: number;
  isSpayed?: boolean;
  feedingInstructions?: string;
  medicationInstructions?: string;
  size: number;
  sizeType: PetSizeEnum;
  onWalksActions: Array<string>;
  onSomeoneEntryActions: Array<string>;
  isDoggyDoorExists?: boolean;
  character?: PetCharacterEnum;
  hasMedication?: boolean;
  dob: number;
}
