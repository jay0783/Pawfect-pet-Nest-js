import { PaginationResponse } from '@pawfect/models';
import { CustomerViewModel } from './customer.vm';
import { OrderViewModel } from './order.vm';
import { PetViewModel } from './pet.vm';

export interface GetNewOrdersResponse
  extends PaginationResponse<NewOrderViewModel> {}

export interface NewOrderViewModel {
  customer: CustomerViewModel;
  order: OrderViewModel;
  pets: PetViewModel[];
  extras: Array<{ name: string; price: number }>;
}
