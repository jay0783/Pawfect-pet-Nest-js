import { PetGenderEnum } from "@pawfect/db/entities/enums";

export interface PetItemListResponse {
  id: string;
  name: string;
  breed: string | null;
  gender: PetGenderEnum;
  imageUrl?: string;
}
