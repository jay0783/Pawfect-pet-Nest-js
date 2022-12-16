import { PetGenderEnum, PetSpeciesEnum } from '@pawfect/db/entities/enums';
import {
  CatInfoEntity,
  DogInfoEntity,
  PetEntity,
  PetMedicationEntity,
  PetVeterinarianEntity,
} from '@pawfect/db/entities';
import { VeterinarianModel } from './veterinarian.model';
import { DogInfoViewModel, getDogInfoForResponse } from './dog-info.vm';
import { CatInfoViewModel, getCatInfoForResponse } from './cat-info.vm';

export interface PetInfoResponse extends DogInfoViewModel, CatInfoViewModel {
  id: string;
  name: string;
  speciesType: PetSpeciesEnum;
  imageUrl: string | null;
  breed: string | null;
  gender: PetGenderEnum;
  hasMedication?: boolean;
  medicalRequirements?: string;
  medicalNotes: string | null;
  veterinarian: VeterinarianModel | null;
}

export async function makePetInfoResponse(
  petEntity: PetEntity,
): Promise<PetInfoResponse> {
  const petAvatar = await petEntity.photo;
  const petMedicationEntity:
    | PetMedicationEntity
    | undefined = await petEntity.medication;
  const petVeterinariansEntities: PetVeterinarianEntity[] = await petEntity.veterinarians;

  const petVeterinarian:
    | PetVeterinarianEntity
    | undefined = petVeterinariansEntities.find((i) => i);
  const petVeterinarianViewModel: VeterinarianModel | null = petVeterinarian
    ? {
        id: petVeterinarian.id,
        name: petVeterinarian.name,
        phoneNumber: petVeterinarian.phoneNumber,
      }
    : null;

  const mainPetInfo: PetInfoResponse = {
    id: petEntity.id,
    name: petEntity.name,
    speciesType: petEntity.type,
    gender: petEntity.gender,
    breed: petEntity.breed || null,
    imageUrl: petAvatar?.url || null,

    medicalRequirements: petMedicationEntity?.requirements || undefined,
    medicalNotes: petMedicationEntity?.notes || null,
    veterinarian: petVeterinarianViewModel,
  };

  let petAddonInfo: DogInfoViewModel | CatInfoViewModel = {};
  switch (petEntity.type) {
    case PetSpeciesEnum.DOG:
      petAddonInfo = getDogInfoForResponse(
        (await petEntity.dogInfo) as DogInfoEntity,
      );
      break;
    case PetSpeciesEnum.CAT:
      petAddonInfo = getCatInfoForResponse(
        (await petEntity.catInfo) as CatInfoEntity,
      );
      break;
  }

  const viewModel: PetInfoResponse = Object.assign(mainPetInfo, petAddonInfo);
  return viewModel;
}
