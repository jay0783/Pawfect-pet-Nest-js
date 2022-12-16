import { Injectable, NotFoundException } from '@nestjs/common';

import { CustomerRepository } from '@pawfect/db/repositories';
import { CustomerEntity } from '@pawfect/db/entities';
import { GetCustomerProfileResponse, makeGetCustomerInfoResponse } from './models';


@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {
  }

  async getCustomerProfileForOrder(customerId: string): Promise<GetCustomerProfileResponse> {
    const customerEntity: CustomerEntity | undefined = await this.customerRepository.getCustomerProfile(customerId);
    if (!customerEntity) {
      throw new NotFoundException('Customer was not found!');
    }

    return makeGetCustomerInfoResponse(customerEntity);
  }
}
