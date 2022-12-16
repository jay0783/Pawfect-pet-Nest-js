import { ServiceEntity } from '@pawfect/db/entities';

export interface ServiceViewModel {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number;
}

export async function makeServiceViewModel(
  serviceEntity: ServiceEntity,
): Promise<ServiceViewModel> {
  const servicePhoto = await serviceEntity.logo;

  return {
    id: serviceEntity.id,
    title: serviceEntity.title,
    imageUrl: servicePhoto?.url || null,
    price: serviceEntity.price,
  };
}
