import { CustomerInfoResponse, makeCustomerInfoResponse } from '@pawfect/models';
import { CustomerEntity } from '@pawfect/db/entities';


export interface GetMyProfileResponse extends CustomerInfoResponse {
}

export function makeGetMyProfileResponse(customerEntity: CustomerEntity): Promise<CustomerInfoResponse> {
  return makeCustomerInfoResponse(customerEntity);
}
