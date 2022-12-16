import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderEntity, ServiceEntity } from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  orderId: string;
  name: string;
  timeFrom: number;
  timeTo: number;
  status: OrderStatusEnum;
  comment: string | null;
  isEmployeeChosen: boolean;
  isEmployeeAccepted: boolean;
}

export async function makeOrderViewModel(
  orderEntity: OrderEntity,
): Promise<OrderViewModel> {
  const serviceEntity: ServiceEntity = await orderEntity.service;
  const employeeEntity = await orderEntity.employee;

  const orderViewModel: OrderViewModel = {
    id: orderEntity.id,
    orderId: orderEntity.id.split('-')[0],
    name: serviceEntity.title,
    status: orderEntity.status,
    isEmployeeChosen: !!employeeEntity,
    isEmployeeAccepted: orderEntity.isEmployeeAccepted,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    comment: orderEntity.comment || null,
  };

  return orderViewModel;
}
