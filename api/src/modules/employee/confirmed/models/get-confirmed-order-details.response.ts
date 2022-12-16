import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderEntity } from "@pawfect/db/entities";
import { makePetViewModel, PetViewModel } from "./pet.vm";
import { makeServiceViewModel, ServiceViewModel } from "./service.vm";


export interface GetConfirmedOrderDetailsResponse {
  id: string;
  dateFrom: number;
  dateTo: number;
  status: OrderStatusEnum;
  comment: string | null;
  customerId: string;
  totalAmount: number;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
}


export async function makeGetConfirmedOrderDetails(orderEntity: OrderEntity): Promise<GetConfirmedOrderDetailsResponse> {
  const mainOrderEntity = await orderEntity.mainOrder;

  const [customerEntity, petEntities, serviceEntity] = await Promise.all([
    mainOrderEntity.customer,
    mainOrderEntity.pets,
    orderEntity.service
  ]);

  const petsViewModelsPromises = petEntities.map(pet => makePetViewModel(pet));

  const [petsViewModels, serviceViewModel] = await Promise.all([
    await Promise.all(petsViewModelsPromises),
    makeServiceViewModel(serviceEntity)
  ]);

  const viewModel: GetConfirmedOrderDetailsResponse = {
    id: orderEntity.id,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    comment: orderEntity.comment || null,
    customerId: customerEntity.id,
    totalAmount: orderEntity.priceWithExtras,

    pets: petsViewModels,
    service: serviceViewModel
  };

  return viewModel;
}
