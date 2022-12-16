import { OrderEntity } from '@pawfect/db/entities';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';

export interface GetHistoryDetailsResponse {
  id: string;
  timeFrom: number;
  timeTo: number;
  totalDuration: number;
  pets: Array<PetViewModel>;
  employee: EmployeeViewModel | null;
  checklist: Array<ChecklistViewModel>;
}

export async function makeGetHistoryDetailsResponse(
  orderEntity: OrderEntity,
): Promise<GetHistoryDetailsResponse> {
  const [
    mainOrderEntity,
    serviceEntity,
    employeeEntity,
    checklist,
  ] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.service,
    orderEntity.employee,
    orderEntity.orderChecks,
  ]);
  const petsEntities = await mainOrderEntity.pets;

  const petsViewModelsPromises = petsEntities.map(async (pet) =>
    makePetViewModel(pet),
  );
  const employeeViewModelPromise = employeeEntity
    ? makeEmployeeViewModel(employeeEntity)
    : Promise.resolve(null);

  const [petsViewModels, employeeViewModel] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    employeeViewModelPromise,
  ]);

  const checklistViewModelsPromises = checklist.map(async (orderCheck) =>
    makeChecklistViewModel(orderCheck),
  );
  const checklistViewModels = await Promise.all(checklistViewModelsPromises);

  // /Orders Listing in ASC
  let checklistViewModel = checklistViewModels.sort(function (a, b) {
    return a.updatedAt - b.updatedAt;
  });

  const viewModel: GetHistoryDetailsResponse = {
    id: orderEntity.id,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    totalDuration: serviceEntity.sumDuration,
    pets: petsViewModels,
    employee: employeeViewModel,
    checklist: checklistViewModels,
  };

  return viewModel;
}
