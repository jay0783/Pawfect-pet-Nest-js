import { OrderEntity } from '@pawfect/db/entities';
import { TimedGeoPositionModel } from '@pawfect/models';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { ActionPointViewModel } from './action-point.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';
import { ChecklistViewModel, makeChecklistViewModel } from './checklist.vm';

export interface GetOrderDetailsResponse {
  id: string;
  homeAddress: string;
  customerHomePosition: { lat: number; long: number };
  pets: Array<PetViewModel>;
  employee: EmployeeViewModel;
  checklist: Array<ChecklistViewModel>;
  points: Array<TimedGeoPositionModel>;
  actionPoints: Array<ActionPointViewModel>;
}

export async function makeGetOrderDetailsResponse(
  orderEntity: OrderEntity,
): Promise<GetOrderDetailsResponse> {
  const mainOrderEntity = await orderEntity.mainOrder;
  const employeeEntity = await orderEntity.employee;
  const checklistEntities = await orderEntity.orderChecks;
  const customerEntity = await mainOrderEntity.customer;
  const petsEntities = await mainOrderEntity.pets;

  const petsViewModelsPromises = petsEntities.map((petEntity) =>
    makePetViewModel(petEntity),
  );
  const checklistViewModelsPromises = checklistEntities.map((checklist) =>
    makeChecklistViewModel(checklist),
  );

  const petsViewModels = await Promise.all(petsViewModelsPromises);
  const checklistViewModels = await Promise.all(checklistViewModelsPromises);
  const employeeViewModel = await makeEmployeeViewModel(employeeEntity!);

  //orderBy Number
  let checklistViewModel = checklistViewModels.sort(function (a, b) {
    return a.numOrder - b.numOrder;
  });

  const viewModel: GetOrderDetailsResponse = {
    id: orderEntity.id,
    homeAddress: customerEntity.address,
    customerHomePosition: {
      lat: customerEntity.addressPosition.coordinates[0],
      long: customerEntity.addressPosition.coordinates[1],
    },
    pets: petsViewModels,
    employee: employeeViewModel,
    checklist: checklistViewModel,
    points: [],
    actionPoints: [],
  };

  return viewModel;
}
