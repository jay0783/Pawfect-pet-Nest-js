import { PetEntity } from '@pawfect/db/entities';

export interface PetViewModel {
  id: string;
  name: string;
  breed: string | null;
  imageUrl: string | null;
}

export async function makePetViewModel(
  petEntity: PetEntity,
): Promise<PetViewModel> {
  const petPhoto = await petEntity.photo;

  const petViewModel: PetViewModel = {
    id: petEntity.id,
    name: petEntity.name,
    breed: petEntity.breed,
    imageUrl: (await petEntity.photo) ? (await petEntity.photo).url : null,
  };

  return petViewModel;
}
