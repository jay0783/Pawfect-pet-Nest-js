import { PetCharacterEnum } from '@pawfect/db/entities/enums';
import { DateTime } from 'aws-sdk/clients/devicefarm';

export interface SaveCatOptions {
  age: number;
  isSpayed?: boolean;
  feedingInstructions?: string;
  medicationInstructions?: string;
  locationOfLitterbox?: string;
  character?: PetCharacterEnum;
  hasMedication?: boolean;
  dob: number;
}
