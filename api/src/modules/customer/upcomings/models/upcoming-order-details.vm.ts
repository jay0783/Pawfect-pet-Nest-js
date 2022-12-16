import { OrderStatusEnum } from '@pawfect/db/entities/order/enums';
import { makePetViewModel, PetViewModel } from './pet.vm';
import { makeServiceViewModel, ServiceViewModel } from './service.vm';
import { OrderEntity } from '@pawfect/db/entities';

export interface UpcomingOrderDetailsViewModel {
  id: string;
  dateFrom: number;
  dateTo: number;
  status: OrderStatusEnum;
  comment: string | null;
  pets: PetViewModel[];
  service: ServiceViewModel;
  createdAt: number;
  totalAmount: number;
}

export async function makeUpcomingOrderDetailsViewModel(
  orderEntity: OrderEntity,
): Promise<UpcomingOrderDetailsViewModel> {
  const mainOrder = await orderEntity.mainOrder;
  const orderPets = await mainOrder.pets;
  const orderService = await orderEntity.service;

  const orderPetsViewModelsPromises = orderPets.map((pet) =>
    makePetViewModel(pet),
  );
  const orderPetsViewModels = await Promise.all(orderPetsViewModelsPromises);
  const orderServiceViewModel = await makeServiceViewModel(orderService);

  return {
    id: orderEntity.id,
    dateFrom: orderEntity.dateFrom.getTime(),
    dateTo: orderEntity.dateTo.getTime(),
    status: orderEntity.status,
    comment: orderEntity.comment || null,
    pets: orderPetsViewModels,
    service: orderServiceViewModel,
    createdAt: orderEntity.createdAt.getTime(),
    totalAmount: mainOrder.totalAmount,
  };
}
