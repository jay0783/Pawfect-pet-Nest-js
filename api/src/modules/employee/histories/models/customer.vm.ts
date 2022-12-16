import { CustomerEntity } from "@pawfect/db/entities";


export interface CustomerViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
}


export async function makeCustomerViewModel(employeeEntity: CustomerEntity): Promise<CustomerViewModel> {
  const avatarEntity = await employeeEntity.avatar;

  const viewModel: CustomerViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: avatarEntity?.url || null
  };

  return viewModel;
}
