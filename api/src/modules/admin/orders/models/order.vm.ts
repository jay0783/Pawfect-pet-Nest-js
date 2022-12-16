import {
  EmployeeEntity,
  OrderEntity,
  ServiceEntity,
} from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  orderId: string;
  name: string;
  serviceCost: number;
  timeFrom: number;
  timeTo: number;
  status: string;
  comment: string | null;
  isEmployeeChosen: boolean;
  isEmployeeAccepted: boolean;
  address: string;
  orderAmount: number;
  discount: number;
  createdAt: number;
  employee: EmployeeViewModel | null;
}

export async function makeOrderViewModel(
  orderEntity: OrderEntity,
): Promise<OrderViewModel> {
  const serviceEntity: ServiceEntity = await orderEntity.service;
  const employeeEntity = await orderEntity.employee;
  let employeeViewModel: EmployeeViewModel | null = null;
  if (employeeEntity) {
    employeeViewModel = await makeEmployeeViewModel(employeeEntity);
  }

  const orderViewModel: OrderViewModel = {
    id: orderEntity.id,
    orderId: orderEntity.id.split('-')[0],
    name: serviceEntity.title,
    serviceCost: serviceEntity.price,
    status: orderEntity.status,
    isEmployeeChosen: !!employeeEntity,
    isEmployeeAccepted: orderEntity.isEmployeeAccepted,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    comment: orderEntity.comment || null,
    address: (await (await orderEntity.mainOrder).customer).address,
    discount: orderEntity.discount,
    orderAmount: orderEntity.priceWithExtras,
    createdAt: orderEntity.createdAt.getTime(),
    employee: employeeViewModel,
  };

  return orderViewModel;
}

export async function makeOrderViewModelMany(
  orders: Array<OrderEntity>,
): Promise<Array<OrderViewModel>> {
  const orderViewModels: Array<OrderViewModel> = new Array();
  for (const orderEntity of orders) {
    const orderViewModel: OrderViewModel = await makeOrderViewModel(
      orderEntity,
    );
    orderViewModels.push(orderViewModel);
  }
  return orderViewModels;
}

export interface EmployeeViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
}

export async function makeEmployeeViewModel(
  employeeEntity: EmployeeEntity,
): Promise<EmployeeViewModel> {
  const avatar = await employeeEntity.avatar;
  const employeeViewModel: EmployeeViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: avatar?.url || null,
  };

  return employeeViewModel;
}
