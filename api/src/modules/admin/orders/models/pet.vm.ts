import { InternalServerErrorException } from '@nestjs/common';
import { MainOrderPetEntity, PetEntity } from '@pawfect/db/entities';

export interface PetViewModel {
  id: string;
  name: string;
  imageUrl?: string;
  speciesType: string;
}

export async function makePetViewModel(
  petEntity: PetEntity,
): Promise<PetViewModel> {
  const petPhoto = await petEntity.photo;
  const petViewModel: PetViewModel = {
    id: petEntity.id,
    name: petEntity.name,
    imageUrl: petPhoto?.url,
    speciesType: petEntity.type,
  };

  return petViewModel;
}

export async function makePetViewModelMany(
  inputEntities: Array<PetEntity | MainOrderPetEntity>,
): Promise<Array<PetViewModel>> {
  const petViewModels: Array<PetViewModel> = new Array();
  for (const inputEntity of inputEntities) {
    let petEntity: PetEntity;
    if (inputEntity instanceof PetEntity) {
      petEntity = inputEntity as PetEntity;
    } else if (inputEntity instanceof MainOrderPetEntity) {
      petEntity = await inputEntity.pet;
    } else {
      throw new InternalServerErrorException("Can't cast model!");
    }

    const petViewModel: PetViewModel = await makePetViewModel(petEntity);

    petViewModels.push(petViewModel);
  }

  return petViewModels;
}
