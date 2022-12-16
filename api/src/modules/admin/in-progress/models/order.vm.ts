import { OrderEntity, ServiceEntity } from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  orderId: string;
  name: string;
  timeFrom: number;
  timeTo: number;
  status: string;
}

export async function makeOrderViewModel(
  orderEntity: OrderEntity,
): Promise<OrderViewModel> {
  const serviceEntity: ServiceEntity = await orderEntity.service;

  const orderViewModel: OrderViewModel = {
    id: orderEntity.id,
    orderId: orderEntity.id.split('-')[0],
    name: serviceEntity.title,
    status: orderEntity.status,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
  };

  return orderViewModel;
}
