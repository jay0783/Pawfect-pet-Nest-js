import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderEntity } from '@pawfect/db/entities';
import { ServiceViewModel, makeServiceViewModel } from './service.vm';
import { PetViewModel, makePetViewModel } from './pet.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';

export interface OrderViewModel {
  id: string;
  timeFrom: number;
  timeTo: number;
  status: OrderStatusEnum;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
  reason: string;
  employee: EmployeeViewModel | null;
}

export async function makeOrderViewModel(
  orderEntity: OrderEntity,
): Promise<OrderViewModel> {
  const [mainOrderEntity, employeeEntity] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.employee,
  ]);

  const [serviceEntity, petsEntities] = await Promise.all([
    mainOrderEntity.service,
    mainOrderEntity.pets,
  ]);

  const petsViewModelsPromises = petsEntities.map((pet) =>
    makePetViewModel(pet),
  );

  const [
    petsViewModels,
    serviceViewModel,
    employeeViewModel,
  ] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    makeServiceViewModel(serviceEntity),
    employeeEntity ? makeEmployeeViewModel(employeeEntity) : null,
  ]);

  const viewModel: OrderViewModel = {
    id: orderEntity.id,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    pets: petsViewModels,
    service: serviceViewModel,
    reason: orderEntity.reasonForCancel,
    employee: employeeViewModel,
  };

  return viewModel;
}
