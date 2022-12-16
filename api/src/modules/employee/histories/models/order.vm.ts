import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderEntity } from "@pawfect/db/entities";
import { ServiceViewModel, makeServiceViewModel } from "./service.vm";
import { PetViewModel, makePetViewModel } from "./pet.vm";
import { CustomerViewModel, makeCustomerViewModel } from "./customer.vm";


export interface OrderViewModel {
  id: string;
  timeFrom: number;
  timeTo: number;
  status: OrderStatusEnum;
  isFirstMeeting: boolean;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
  customer: CustomerViewModel | null;
}


export async function makeOrderViewModel(orderEntity: OrderEntity): Promise<OrderViewModel> {
  const mainOrderEntity = await orderEntity.mainOrder;

  const [customerEntity, serviceEntity, petsEntities] = await Promise.all([
    mainOrderEntity.customer,
    mainOrderEntity.service,
    mainOrderEntity.pets
  ]);

  const petsViewModelsPromises = petsEntities.map(pet => makePetViewModel(pet));

  const [petsViewModels, serviceViewModel, employeeViewModel] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    makeServiceViewModel(serviceEntity),
    customerEntity ? makeCustomerViewModel(customerEntity) : null
  ]);

  const viewModel: OrderViewModel = {
    id: orderEntity.id,
    timeFrom: orderEntity.dateFrom.getTime(),
    timeTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    isFirstMeeting: orderEntity.isFirstMeeting,
    pets: petsViewModels,
    service: serviceViewModel,
    customer: employeeViewModel
  };

  return viewModel;
}
