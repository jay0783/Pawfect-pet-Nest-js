import { OrderEntity } from '@pawfect/db/entities';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { CustomerViewModel, makeCustomerViewModel } from './index';

export interface GetHistoryOrderDetailsResponse {
  pets: Array<PetViewModel>;
  employee: EmployeeViewModel | null;
  checklist: Array<ChecklistViewModel>;
  customer: CustomerViewModel;
}

export async function makeGetHistoryOrderDetailsResponse(
  orderEntity: OrderEntity,
): Promise<GetHistoryOrderDetailsResponse> {
  const [mainOrder, employee, orderChecks] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.employee,
    orderEntity.orderChecks,
  ]);

  const pets = await mainOrder.pets;
  const customerEntity = await mainOrder.customer;
  const petsViewModelsPromises = pets.map(async (pet) => makePetViewModel(pet));
  const checklistViewModelsPromises = orderChecks.map(async (check) =>
    makeChecklistViewModel(check),
  );

  const [
    petsViewModels,
    employeeViewModel,
    checklistViewModels,
    customerViewModel,
  ] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    employee ? makeEmployeeViewModel(employee) : Promise.resolve(null),
    Promise.all(checklistViewModelsPromises),
    makeCustomerViewModel(customerEntity),
  ]);

  const viewModel: GetHistoryOrderDetailsResponse = {
    pets: petsViewModels,
    employee: employeeViewModel,
    checklist: checklistViewModels,
    customer: customerViewModel,
  };

  return viewModel;
}
