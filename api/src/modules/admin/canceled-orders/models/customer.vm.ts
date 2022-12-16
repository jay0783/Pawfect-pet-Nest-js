import { CustomerEntity } from '@pawfect/db/entities';


export interface CustomerViewModel {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  imageUrl: string | null;
}

export async function makeCustomerViewModel(customerEntity: CustomerEntity): Promise<CustomerViewModel> {
  const photoEntity = await customerEntity.avatar;

  return {
    id: customerEntity.id,
    name: customerEntity.name,
    surname: customerEntity.surname,
    phoneNumber: customerEntity.phoneNumber,
    imageUrl: photoEntity?.url || null,
  };
}
