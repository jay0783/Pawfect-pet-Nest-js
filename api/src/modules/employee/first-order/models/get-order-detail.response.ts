import { FreeOrderEntity, OrderEntity } from '@pawfect/db/entities';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { ExtraViewModel, makeExtraViewModel } from './extra.vm';
import { FirstOrderViewModel } from './new-order.vm';

export interface GetNewOrderDetailsResponse {
  id: string;
  status: string;
  timeFrom: number;
  customer: CustomerViewModel;
  extra: ExtraViewModel;
}

export async function makeNewOrderDetailsViewModel(
  orderEntity: FreeOrderEntity,
): Promise<GetNewOrderDetailsResponse> {
  const serviceEntity = await orderEntity.extra;
  const customerEntity = await orderEntity.customer;

  const [serviceViewModel, customerViewModel] = await Promise.all([
    makeExtraViewModel(serviceEntity),
    makeCustomerViewModel(customerEntity),
  ]);

  const newOrderViewModel: GetNewOrderDetailsResponse = {
    id: orderEntity.id,
    status: orderEntity.status,
    timeFrom: orderEntity.dateFrom.getTime(),
    customer: customerViewModel,
    extra: serviceViewModel,
  };

  return newOrderViewModel;
}
