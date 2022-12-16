import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderEntity } from "@pawfect/db/entities";
import { ServiceViewModel, makeServiceViewModel } from "./service.vm";
import { PetViewModel, makePetViewModel } from "./pet.vm";


export interface OrderViewModel {
  id: string;
  mainOrderFirstDate: number;
  mainOrderLastDate: number;
  status: OrderStatusEnum;
  isFirstMeet: boolean;
  dateFrom: number;
  dateTo: number;
  pets: PetViewModel[];
  service: ServiceViewModel;
}


export async function makeOrderViewModel(orderEntity: OrderEntity): Promise<OrderViewModel> {
  const [mainOrderEntity, serviceEntity] = await Promise.all([orderEntity.mainOrder, orderEntity.service]);
  const petsEntities = await mainOrderEntity.pets;

  const petsViewModelPromises = petsEntities.map(async petEntity => makePetViewModel(petEntity));

  const [petsViewModels, serviceViewModel] = await Promise.all([
    Promise.all(petsViewModelPromises),
    makeServiceViewModel(serviceEntity),
  ]);

  const viewModel: OrderViewModel = {
    id: orderEntity.id,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    isFirstMeet: orderEntity.isFirstMeeting,
    mainOrderFirstDate: mainOrderEntity.firstDate.getTime(),
    mainOrderLastDate: mainOrderEntity.lastDate.getTime(),
    pets: petsViewModels,
    service: serviceViewModel
  };

  return viewModel;
}
