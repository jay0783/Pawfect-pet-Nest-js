import { OrderEntity } from '@pawfect/db/entities';
import { PaginationResponse } from '@pawfect/models';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { OrderViewModel, makeOrderViewModel } from './order.vm';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';
import { CustomerViewModel, makeCustomerViewModel } from './index';

export interface GetOrdersResponse
  extends PaginationResponse<OrderItemViewModel> {}

export interface OrderItemViewModel {
  employee: EmployeeViewModel | null;
  order: OrderViewModel;
  checklist: Array<ChecklistViewModel>;
  pets: Array<PetViewModel>;
  customer: CustomerViewModel;
}

export async function makeOrderItemViewModel(
  orderEntity: OrderEntity,
): Promise<OrderItemViewModel> {
  const [mainOrders, employee, orderChecks] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.employee,
    orderEntity.orderChecks,
  ]);

  const customerEntity = await mainOrders.customer;
  const pets = await mainOrders.pets;
  const petViewModelsPromises = pets.map(async (pet) => makePetViewModel(pet));
  const orderChecksPromises = orderChecks.map(async (orderCheck) =>
    makeChecklistViewModel(orderCheck),
  );

  const [
    petViewModels,
    orderChecksViewModels,
    orderViewModel,
    employeeViewModel,
    customerViewModel,
  ] = await Promise.all([
    Promise.all(petViewModelsPromises),
    Promise.all(orderChecksPromises),
    makeOrderViewModel(orderEntity),
    employee ? makeEmployeeViewModel(employee) : Promise.resolve(null),
    makeCustomerViewModel(customerEntity),
  ]);

  const viewModel: OrderItemViewModel = {
    employee: employeeViewModel,
    order: orderViewModel,
    checklist: orderChecksViewModels,
    pets: petViewModels,
    customer: customerViewModel,
  };
  return viewModel;
}
