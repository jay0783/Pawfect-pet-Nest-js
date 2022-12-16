import { CustomerEntity } from "@pawfect/db/entities";


export interface CustomerViewModel {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  imageUrl: string | null;
}


export async function makeCustomerViewModel(customerEntity: CustomerEntity): Promise<CustomerViewModel> {
  const customerAvatar = await customerEntity.avatar;

  const customerViewModel: CustomerViewModel = {
    id: customerEntity.id,
    name: customerEntity.name,
    surname: customerEntity.surname,
    phoneNumber: customerEntity.phoneNumber,
    imageUrl: customerAvatar?.url || null
  };

  return customerViewModel;
}
