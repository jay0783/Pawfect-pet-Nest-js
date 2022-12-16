import { PetEntity } from "@pawfect/db/entities";


export interface PetViewModel {
  id: string;
  name: string;
  breed: string | null;
  imageUrl: string | null;
}


export async function makePetViewModel(pet: PetEntity): Promise<PetViewModel> {
  const petPhoto = await pet.photo;

  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    imageUrl: petPhoto?.url || null,
  };
}
