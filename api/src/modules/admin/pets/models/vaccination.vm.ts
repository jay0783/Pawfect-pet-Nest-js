import { PetVaccinationEntity } from '@pawfect/db/entities';

export interface VaccinationViewModel {
  id: string;
  imageUrl: string;
}

export async function makeVaccinationViewModel(
  vaccinationEntity: PetVaccinationEntity,
): Promise<VaccinationViewModel> {
  const photoEntity = await vaccinationEntity.photo;
  const viewModel: VaccinationViewModel = {
    id: vaccinationEntity.id,
    imageUrl: photoEntity.url,
  };
  return viewModel;
}
