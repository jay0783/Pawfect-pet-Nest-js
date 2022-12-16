import { PaginationResponse } from '@pawfect/models';
import { ExtraOrderViewModel } from 'src/modules/customer/orders/models';
import { CustomerViewModel } from './customer.vm';
import { ExtraViewModel } from './extra-order.vm';
import { OrderViewModel } from './first-order.vm';

export interface GetFirstOrdersResponse
  extends PaginationResponse<FirstOrderViewModel> {}

export interface FirstOrderViewModel {
  customer: CustomerViewModel;
  order: OrderViewModel;
  extras: ExtraViewModel;
}
