import { CustomerEntity, PhotoEntity, UserEntity } from '@pawfect/db/entities';
import { PaginationResponse } from '@pawfect/models';

export interface CustomersResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  imageUrl?: string;
  customerId: string;
}

export async function makeCustomersResponse(
  customerEntity: CustomerEntity,
): Promise<CustomersResponse> {
  const customerUser: UserEntity = await customerEntity.user;
  const avatarEntity: PhotoEntity | undefined = await customerEntity.avatar;

  return {
    id: customerEntity.id,
    name: customerEntity.name,
    surname: customerEntity.surname,
    imageUrl: avatarEntity?.url,
    email: customerUser.email,
    customerId: customerEntity.id.split('-')[0],
  };
}

export async function makeCustomersResponseMany(
  inputEntities: Array<CustomerEntity>,
): Promise<PaginationResponse<CustomersResponse>> {
  const customerViewModels: Array<CustomersResponse> = new Array();
  for (const inputEntity of inputEntities) {
    const customerViewModel: CustomersResponse = await makeCustomersResponse(
      inputEntity,
    );

    customerViewModels.push(customerViewModel);
  }

  return { items: customerViewModels };
}
