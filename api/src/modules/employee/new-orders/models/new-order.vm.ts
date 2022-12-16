import { OrderEntity } from "@pawfect/db/entities";
import { ServiceViewModel, makeServiceViewModel } from "./service.vm";
import { PetViewModel, makePetViewModel } from "./pet.vm";


export interface NewOrderViewModel {
  id: string;
  status: string;
  timeFrom: number;
  timeTo: number;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
}


export async function makeNewOrderViewModel(orderEntity: OrderEntity): Promise<NewOrderViewModel> {
  const mainOrderEntity = await orderEntity.mainOrder;
  const petsEntities = await mainOrderEntity.pets;
  const serviceEntity = await mainOrderEntity.service;

  const serviceViewModel = await makeServiceViewModel(serviceEntity);
  const petsViewModelsPromises = petsEntities.map(petEntity => makePetViewModel(petEntity));
  const petViewModels = await Promise.all(petsViewModelsPromises);


  const viewModel: NewOrderViewModel = {
    id: orderEntity.id,
    status: orderEntity.status,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    pets: petViewModels,
    service: serviceViewModel
  };

  return viewModel;
}
