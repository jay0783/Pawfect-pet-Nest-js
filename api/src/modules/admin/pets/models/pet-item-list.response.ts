import { PetGenderEnum } from '@pawfect/db/entities/enums';

export interface PetItemListResponse {
  id: string;
  name: string;
  type: string;
  gender: PetGenderEnum;
  imageUrl?: string;
}
