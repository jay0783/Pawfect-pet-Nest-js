import { PetGenderEnum } from '@pawfect/db/entities/enums';

export interface CardItemListResponse {
  id: string;
  number: string;
  token: string;
  isChosen: boolean;
  cvc: string | undefined;
  expiration: string | undefined;
}
