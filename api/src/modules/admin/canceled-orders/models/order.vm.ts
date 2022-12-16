import { OrderCancellationEntity } from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  name: string;
  timeFrom: number;
  timeTo: number;
  customerCancellationComment: string | null;
  amount: number;
}

export async function makeOrderViewModel(
  orderCancellationEntity: OrderCancellationEntity,
): Promise<OrderViewModel> {
  const orderEntity = await orderCancellationEntity.order;
  const mainOrderEntity = await orderEntity.mainOrder;
  const orderServiceEntity = await orderEntity.service;

  return {
    id: orderEntity.id,
    name: orderServiceEntity.title,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    customerCancellationComment: orderCancellationEntity.reason || null,
    amount: orderEntity.priceWithExtras,
  };
}
