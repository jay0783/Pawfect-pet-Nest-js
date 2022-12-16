import { ServiceEntity } from "@pawfect/db/entities";


export interface ServiceViewModel {
  id: string;
  title: string;
  imageUrl: string | null;
}


export async function makeServiceViewModel(serviceEntity: ServiceEntity): Promise<ServiceViewModel> {
  const serviceLogo = await serviceEntity.logo;

  const serviceViewModel: ServiceViewModel = {
    id: serviceEntity.id,
    title: serviceEntity.title,
    imageUrl: serviceLogo?.url || null
  };

  return serviceViewModel;
}
