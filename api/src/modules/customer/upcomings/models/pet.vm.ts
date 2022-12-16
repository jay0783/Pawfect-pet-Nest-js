import { PetEntity } from "@pawfect/db/entities";


export interface PetViewModel {
  id: string;
  name: string;
  imageUrl: string | null;
}


export async function makePetViewModel(petEntity: PetEntity): Promise<PetViewModel> {
  const petPhoto = await petEntity.photo;

  return {
    id: petEntity.id,
    name: petEntity.name,
    imageUrl: petPhoto?.url || null,
  };
}
