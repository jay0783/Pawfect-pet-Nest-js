import { PetGenderEnum } from '@pawfect/db/entities/enums';

export interface CardItemListResponse {
  id: string;
  fourDigits: string;
  token: string;
  isChosen: boolean;
  // reference: string;
}
