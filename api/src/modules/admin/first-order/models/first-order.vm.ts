import {
  FreeOrderEntity,
  OrderEntity,
  ServiceEntity,
} from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  dateFrom: number;
  status: string;
  comment: string | null;
}

export async function makeFirstOrderViewModel(
  orderEntity: FreeOrderEntity,
): Promise<OrderViewModel> {
  //   const serviceEntity: ServiceEntity = await orderEntity.service;
  const employeeEntity = await orderEntity.employee;

  const firstOrderViewModel: OrderViewModel = {
    id: orderEntity.id,
    status: orderEntity.status,
    dateFrom: orderEntity.dateFrom.getTime(),
    comment: orderEntity.comment || null,
  };

  return firstOrderViewModel;
}
