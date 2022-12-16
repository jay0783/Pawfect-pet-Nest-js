import { OrderEntity } from '@pawfect/db/entities';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { CustomerViewModel, makeCustomerViewModel } from './index';

export interface GetOrderDetailsResponse {
  pets: Array<PetViewModel>;
  employee: EmployeeViewModel | null;
  checklist: Array<ChecklistViewModel>;
  customer: CustomerViewModel;
}

export async function makeGetOrderDetailsResponse(
  orderEntity: OrderEntity,
): Promise<GetOrderDetailsResponse> {
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
    employeeViewModel,
    customerViewModel,
  ] = await Promise.all([
    Promise.all(petViewModelsPromises),
    Promise.all(orderChecksPromises),
    employee ? makeEmployeeViewModel(employee) : Promise.resolve(null),
    makeCustomerViewModel(customerEntity),
  ]);

  const viewModel: GetOrderDetailsResponse = {
    pets: petViewModels,
    employee: employeeViewModel,
    checklist: orderChecksViewModels,
    customer: customerViewModel,
  };

  return viewModel;
}
