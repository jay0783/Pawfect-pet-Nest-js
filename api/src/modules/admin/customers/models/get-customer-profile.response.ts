import { CustomerInfoResponse, makeCustomerInfoResponse } from '@pawfect/models';
import { CustomerEntity } from '@pawfect/db/entities';


export interface GetCustomerProfileResponse extends CustomerInfoResponse {
}

export function makeGetCustomerProfileResponse(customerEntity: CustomerEntity) {
  return makeCustomerInfoResponse(customerEntity);
}
