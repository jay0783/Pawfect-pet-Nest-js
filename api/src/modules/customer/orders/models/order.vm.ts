import { OrderEntity } from '@pawfect/db/entities';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';

export interface OrderViewModel {
  id: string;
  dateFrom: number;
  dateTo: number;
  status: OrderStatusEnum;
  createdAt: Date;
}

export function makeOrderViewModel(orderEntity: OrderEntity): OrderViewModel {
  return {
    id: orderEntity.id,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    createdAt: orderEntity.createdAt,
  };
}

export function makeOrderViewModelMany(
  orders: Array<OrderEntity>,
): Array<OrderViewModel> {
  return orders.map((orderEntity) => makeOrderViewModel(orderEntity));
}
