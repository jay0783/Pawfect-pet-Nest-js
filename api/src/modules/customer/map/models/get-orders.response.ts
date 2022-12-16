import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderEntity } from "@pawfect/db/entities";
import { PaginationResponse } from "@pawfect/models";
import { ServiceViewModel, makeServiceViewModel } from "./service.vm";
import { PetViewModel, makePetViewModel } from "./pet.vm";


export interface GetOrdersResponse extends PaginationResponse<OrderViewModel> { }


export interface OrderViewModel {
  id: string;
  mainOrderFirstDate: number;
  mainOrderLastDate: number;
  status: OrderStatusEnum;
  isFirstMeet: boolean;
  dateFrom: number;
  dateTo: number;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
}


export async function makeOrderViewModel(orderEntity: OrderEntity): Promise<OrderViewModel> {
  const [mainOrderEntity, serviceEntity] = await Promise.all([
    orderEntity.mainOrder,
    orderEntity.service
  ]);

  const pets = await mainOrderEntity.pets;

  const makePetsViewModelsPromises = pets.map(pet => makePetViewModel(pet));
  const [serviceViewModel, petsViewModels] = await Promise.all([
    makeServiceViewModel(serviceEntity),
    Promise.all(makePetsViewModelsPromises)
  ]);


  const viewModel: OrderViewModel = {
    id: orderEntity.id,
    mainOrderFirstDate: mainOrderEntity.firstDate.getTime(),
    mainOrderLastDate: mainOrderEntity.lastDate.getTime(),
    status: orderEntity.status,
    isFirstMeet: orderEntity.isFirstMeeting,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    pets: petsViewModels,
    service: serviceViewModel
  };

  return viewModel;
}
