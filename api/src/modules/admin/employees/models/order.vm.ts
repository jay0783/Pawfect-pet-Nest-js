import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderEntity, ServiceEntity } from "@pawfect/db/entities";


export interface OrderViewModel {
  id: string;
  name: string;
  dateFrom: number;
  dateTo: number;
  status: OrderStatusEnum;
}


export async function makeOrderViewModel(orderEntity: OrderEntity): Promise<OrderViewModel> {
  const serviceEntity: ServiceEntity = await orderEntity.service;

  const orderViewModel: OrderViewModel = {
    id: orderEntity.id,
    name: serviceEntity.title,
    status: orderEntity.status,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime()
  };

  return orderViewModel;
}
