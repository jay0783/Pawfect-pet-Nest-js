import { CustomerEntity } from '@pawfect/db/entities';


export interface CustomerViewModel {
  id: string;
  name: string;
  surname: string;
  homeAddress: string;
  imageUrl: string | null;
}

export async function makeCustomerViewModel(customerEntity: CustomerEntity): Promise<CustomerViewModel> {
  const photoEntity = await customerEntity.avatar;

  return {
    id: customerEntity.id,
    name: customerEntity.name,
    surname: customerEntity.surname,
    homeAddress: customerEntity.address,
    imageUrl: photoEntity?.url || null,
  };
}
