import {
  OrderEntity,
  ServiceEntity,
  EmployeeEntity,
} from '@pawfect/db/entities';

export interface OrderViewModel {
  id: string;
  name: string;
  timeFrom: number;
  timeTo: number;
  status: string;
  comment: string | null;
  // isEmployeeChosen: boolean;
  // isEmployeeAccepted: boolean;
  address: string;
  orderId: string;
  orderAmount: number;
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
    name: serviceEntity.title,
    status: orderEntity.status,
    // isEmployeeChosen: !!employeeEntity,
    // isEmployeeAccepted: orderEntity.isEmployeeAccepted ,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    comment: orderEntity.comment || null,
    address: (await (await orderEntity.mainOrder).customer).address,
    orderId: orderEntity.id.split('-')[0],
    orderAmount: orderEntity.priceWithExtras,
    employee: employeeViewModel,
  };

  return orderViewModel;
}

export async function makeOrderViewModelMany(
  orders: Array<OrderEntity>,
): Promise<Array<OrderViewModel>> {
  // return orders.map(
  //   async (orderEntity) => await makeOrderViewModel(orderEntity),
  // );
  const orderViewModels: Array<OrderViewModel> = new Array();
  for (const orderEntity of orders) {
    const petViewModel: OrderViewModel = await makeOrderViewModel(orderEntity);

    orderViewModels.push(petViewModel);
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
