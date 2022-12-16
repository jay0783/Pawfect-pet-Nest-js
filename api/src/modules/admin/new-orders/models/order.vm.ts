import { OrderEntity, ServiceEntity } from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  service: string;
  serviceCost: number;
  timeFrom: number;
  timeTo: number;
  status: string;
  payment_status?: string;
  comment: string | null;
  isEmployeeChosen: boolean;
  isEmployeeAccepted: boolean;
  address: string;
  discount: number;
  orderAmount: number;
  orderId: string;
  createdAt: number;
}

export async function makeOrderViewModel(
  orderEntity: OrderEntity,
): Promise<OrderViewModel> {
  const serviceEntity: ServiceEntity = await orderEntity.service;
  const employeeEntity = await orderEntity.employee;
  const orderPayment = await orderEntity.orderPayments;

  const orderViewModel: OrderViewModel = {
    id: orderEntity.id,
    orderId: orderEntity.id.split('-')[0],
    service: serviceEntity.title,
    serviceCost: serviceEntity.price,
    status: orderEntity.status,
    payment_status: orderPayment?.status ? orderPayment.status : '',
    isEmployeeChosen: !!employeeEntity,
    isEmployeeAccepted: orderEntity.isEmployeeAccepted,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    comment: orderEntity.comment || null,
    address: (await (await orderEntity.mainOrder).customer).address,
    discount: orderEntity.discount,
    orderAmount: orderEntity.priceWithExtras,
    createdAt: orderEntity.createdAt.getTime(),
  };
  return orderViewModel;
}
