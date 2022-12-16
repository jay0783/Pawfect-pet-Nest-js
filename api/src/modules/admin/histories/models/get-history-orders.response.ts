import { OrderEntity } from '@pawfect/db/entities';
import { PaginationResponse } from '@pawfect/models';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { OrderViewModel, makeOrderViewModel } from './order.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { CustomerViewModel, makeCustomerViewModel } from './index';

export interface GetHistoryOrdersResponse
  extends PaginationResponse<HistoryOrderViewModel> {}

export interface HistoryOrderViewModel {
  employee: EmployeeViewModel | null;
  order: OrderViewModel;
  pets: Array<PetViewModel>;
  customer: CustomerViewModel;
}

export async function makeHistoryOrderViewModel(
  orderEntity: OrderEntity,
): Promise<HistoryOrderViewModel> {
  const [mainOrder, employee] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.employee,
  ]);

  const pets = await mainOrder.pets;
  const customerEntity = await mainOrder.customer;
  const petViewModelsPromises = pets.map(async (pet) => makePetViewModel(pet));

  const [
    petViewModels,
    employeeViewModel,
    orderViewModel,
    customerViewModel,
  ] = await Promise.all([
    await Promise.all(petViewModelsPromises),
    employee ? makeEmployeeViewModel(employee) : Promise.resolve(null),
    makeOrderViewModel(orderEntity),
    makeCustomerViewModel(customerEntity),
  ]);

  const viewModel: HistoryOrderViewModel = {
    employee: employeeViewModel,
    order: orderViewModel,
    pets: petViewModels,
    customer: customerViewModel,
  };

  return viewModel;
}
