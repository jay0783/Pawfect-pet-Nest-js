import { OrderEntity } from '@pawfect/db/entities';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { ServiceViewModel, makeServiceViewModel } from './service.vm';

export interface GetHistoryDetailsResponse {
  id: string;
  timeFrom: number;
  timeTo: number;
  totalDuration: number;
  service: ServiceViewModel;
  pets: Array<PetViewModel>;
  customer: CustomerViewModel | null;
  checklist: Array<ChecklistViewModel>;
}

export async function makeGetHistoryDetailsResponse(
  orderEntity: OrderEntity,
): Promise<GetHistoryDetailsResponse> {
  const [mainOrderEntity, serviceEntity, checklist] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.service,
    orderEntity.orderChecks,
  ]);

  const petsEntities = await mainOrderEntity.pets;
  const customerEntity = await mainOrderEntity.customer;

  const petsViewModelsPromises = petsEntities.map(async (pet) =>
    makePetViewModel(pet),
  );
  const customerViewModelPromise = customerEntity
    ? makeCustomerViewModel(customerEntity)
    : Promise.resolve(null);

  const [
    petsViewModels,
    customerViewModel,
    serviceViewModel,
  ] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    customerViewModelPromise,
    makeServiceViewModel(serviceEntity),
  ]);

  const checklistViewModelsPromises = checklist.map(async (orderCheck) =>
    makeChecklistViewModel(orderCheck),
  );
  const checklistViewModels = await Promise.all(checklistViewModelsPromises);

  const viewModel: GetHistoryDetailsResponse = {
    id: orderEntity.id,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    totalDuration: serviceEntity.sumDuration,
    service: serviceViewModel,
    pets: petsViewModels,
    customer: customerViewModel,
    checklist: checklistViewModels,
  };

  return viewModel;
}
