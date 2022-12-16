import { OrderEntity } from '@pawfect/db/entities';
import { PaginationResponse } from '@pawfect/models';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { OrderViewModel, makeOrderViewModel } from './order.vm';
import { ServiceViewModel, makeServiceViewModel } from './service.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';

export interface GetDayScheduleResponse
  extends PaginationResponse<ScheduleItem> {}

export interface ScheduleItem {
  pets: Array<PetViewModel>;
  employee: EmployeeViewModel;
  customer: CustomerViewModel;
  order: OrderViewModel;
  service: ServiceViewModel;
}

export async function makeScheduleItem(
  orderEntity: OrderEntity,
): Promise<ScheduleItem> {
  const [mainOrder, employee, service] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.employee,
    orderEntity.service,
  ]);

  const [pets, customer] = await Promise.all([
    mainOrder.pets,
    mainOrder.customer,
  ]);

  const petsViewModelsPromises = pets.map(async (pet) => makePetViewModel(pet));

  const [
    petsViewModel,
    employeeViewModel,
    customerViewModel,
    orderViewModel,
    serviceViewModel,
  ] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    makeEmployeeViewModel(employee!),
    makeCustomerViewModel(customer),
    makeOrderViewModel(orderEntity),
    makeServiceViewModel(service),
  ]);

  const viewModel: ScheduleItem = {
    pets: petsViewModel,
    employee: employeeViewModel,
    customer: customerViewModel,
    order: orderViewModel,
    service: serviceViewModel,
  };

  return viewModel;
}
