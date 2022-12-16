import { ServiceEntity } from '@pawfect/db/entities';

export interface ServiceViewModel {
  id: string;
  title: string;
  serviceCost: number;
  imageUrl: string | null;
}

export async function makeServiceViewModel(
  serviceEntity: ServiceEntity,
): Promise<ServiceViewModel> {
  const servicePhoto = await serviceEntity.logo;

  return {
    id: serviceEntity.id,
    title: serviceEntity.title,
    serviceCost: serviceEntity.price,
    imageUrl: servicePhoto?.url || null,
  };
}
