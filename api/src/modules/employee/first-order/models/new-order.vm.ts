import { FreeOrderEntity, OrderEntity } from '@pawfect/db/entities';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { ExtraViewModel, makeExtraViewModel } from './extra.vm';

export interface FirstOrderViewModel {
  id: string;
  status: string;
  timeFrom: number;
  extra: ExtraViewModel;
  customer: CustomerViewModel;
}

export async function makeNewOrderViewModel(
  orderEntity: FreeOrderEntity,
): Promise<FirstOrderViewModel> {
  const serviceEntity = await orderEntity.extra;
  const customerEntity = await orderEntity.customer;
  const serviceViewModel = await makeExtraViewModel(serviceEntity);
  const customerViewModel = await makeCustomerViewModel(customerEntity);
  const viewModel: FirstOrderViewModel = {
    id: orderEntity.id,
    status: orderEntity.status,
    timeFrom: orderEntity.dateFrom.getTime(),
    customer: customerViewModel,
    extra: serviceViewModel,
  };

  return viewModel;
}
