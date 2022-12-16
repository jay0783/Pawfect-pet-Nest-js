import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderEntity } from '@pawfect/db/entities';
import { makeServiceViewModel, ServiceViewModel } from './service.vm';
import { makePetViewModel, PetViewModel } from './pet.vm';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';

export interface ConfirmedOrderViewModel {
  id: string;
  status: OrderStatusEnum;
  dateFrom: number;
  dateTo: number;
  isFirstMeet: boolean;

  pets: Array<PetViewModel>;
  service: ServiceViewModel;
  customer: CustomerViewModel;
  employee: EmployeeViewModel;
}

export async function makeConfirmedOrderViewModel(
  orderEntity: OrderEntity,
): Promise<ConfirmedOrderViewModel> {
  const mainOrderEntity = await orderEntity.mainOrder;
  const serviceEntity = await orderEntity.service;
  const petsEntities = await mainOrderEntity.pets;
  const customerEntity = await mainOrderEntity.customer;
  const employeeEntity = await orderEntity.employee;

  const makePetViewModelsPromises = petsEntities.map((petEntity) =>
    makePetViewModel(petEntity),
  );
  const [
    petsViewModels,
    serviceViewModel,
    customerViewModel,
    employeeViewModel,
  ] = await Promise.all([
    Promise.all(makePetViewModelsPromises),
    makeServiceViewModel(serviceEntity),
    makeCustomerViewModel(customerEntity),
    makeEmployeeViewModel(employeeEntity!),
  ]);

  const viewModel: ConfirmedOrderViewModel = {
    id: orderEntity.id,
    status: orderEntity.status,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    isFirstMeet: orderEntity.isFirstMeeting,

    pets: petsViewModels,
    service: serviceViewModel,
    customer: customerViewModel,
    employee: employeeViewModel,
  };

  return viewModel;
}
