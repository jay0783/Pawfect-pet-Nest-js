import { ExtraServiceEntity, ServiceEntity } from '@pawfect/db/entities';

export interface ExtrasServiceViewModel {
  id: string;
  title: string;
  description: string;
  price: number;
}

export async function makeExtraServiceViewModel(
  extraServiceEntity: ExtraServiceEntity,
): Promise<ExtrasServiceViewModel> {
  const serviceLogo = await extraServiceEntity.logo;
  const extraServiceViewModel: ExtrasServiceViewModel = {
    id: extraServiceEntity.id,
    title: extraServiceEntity.title,
    description: extraServiceEntity.description,
    price: extraServiceEntity.price,
  };

  return extraServiceViewModel;
}
