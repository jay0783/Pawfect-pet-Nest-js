import { OrderEntity } from '@pawfect/db/entities';
import { makeServiceViewModel, ServiceViewModel } from './service.vm';
import { CustomerViewModel, makeCustomerViewModel } from './customer.vm';
import { makePetViewModel, PetViewModel } from './pet.vm';

export interface GetNewOrderDetailsResponse {
  id: string;
  isFirstMeeting: boolean;
  status: string;
  timeFrom: number;
  timeTo: number;
  customer: CustomerViewModel;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
}

export async function makeNewOrderDetailsViewModel(
  orderEntity: OrderEntity,
): Promise<GetNewOrderDetailsResponse> {
  const mainOrderEntity = await orderEntity.mainOrder;
  const serviceEntity = await orderEntity.service;
  const customerEntity = await mainOrderEntity.customer;
  const petsEntity = await mainOrderEntity.pets;

  const petsViewModelPromises = petsEntity.map((petEntity) =>
    makePetViewModel(petEntity),
  );

  const [
    serviceViewModel,
    customerViewModel,
    petsViewModels,
  ] = await Promise.all([
    makeServiceViewModel(serviceEntity),
    makeCustomerViewModel(customerEntity),
    await Promise.all(petsViewModelPromises),
  ]);

  const newOrderViewModel: GetNewOrderDetailsResponse = {
    id: orderEntity.id,
    isFirstMeeting: orderEntity.isFirstMeeting,
    status: orderEntity.status,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    customer: customerViewModel,
    pets: petsViewModels,
    service: serviceViewModel,
  };

  return newOrderViewModel;
}
