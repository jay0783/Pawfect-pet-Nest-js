import { OrderEntity, ServiceEntity } from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  orderId: string;
  service: string;
  serviceCost: number;
  dateFrom: number;
  dateTo: number;
  status: string;
  payment_status?: string;
  comment: string | null;
  isEmployeeChosen: boolean;
  isEmployeeAccepted: boolean;
  address: string;
  orderAmount: number;
  discount: number;
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
    payment_status: orderPayment?.status ? orderPayment.status : '',
    status: orderEntity.status,
    isEmployeeChosen: !!employeeEntity,
    isEmployeeAccepted: orderEntity.isEmployeeAccepted,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    comment: orderEntity.comment || null,
    address: (await (await orderEntity.mainOrder).customer).address,
    discount: orderEntity.discount,
    orderAmount: orderEntity.priceWithExtras,
    createdAt: orderEntity.createdAt.getTime(),
  };

  return orderViewModel;
}
