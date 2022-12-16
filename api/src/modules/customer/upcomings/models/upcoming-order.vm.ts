import { OrderEntity } from '@pawfect/db/entities';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { makePetViewModel, PetViewModel } from './pet.vm';
import { makeServiceViewModel, ServiceViewModel } from './service.vm';
import { EmployeeViewModel, makeEmployeeViewModel } from './employee.vm';

export interface UpcomingOrderViewModel {
  id: string;
  pets: PetViewModel[];
  service: ServiceViewModel;
  status: OrderStatusEnum;
  employee: EmployeeViewModel | null;
  isFirstMeet: boolean;
  dateFrom: number;
  dateTo: number;
  // createdAt: number;
}

export async function makeUpcomingOrderViewModel(
  order: OrderEntity,
): Promise<UpcomingOrderViewModel> {
  const [mainOrder, orderService, orderEmployee] = await Promise.all([
    order.mainOrder,
    order.service,
    order.employee,
  ]);

  const mainOrderPets = await mainOrder.pets;

  const mainOrderPetsViewModelsPromise = mainOrderPets.map((pet) =>
    makePetViewModel(pet),
  );
  const mainOrderPetsViewModels = await Promise.all(
    mainOrderPetsViewModelsPromise,
  );

  const orderServiceViewModel = await makeServiceViewModel(orderService);
  const orderEmployeeViewModel = orderEmployee
    ? await makeEmployeeViewModel(orderEmployee)
    : null;

  return {
    id: order.id,
    pets: mainOrderPetsViewModels,
    service: orderServiceViewModel,
    status: order.status,
    employee: orderEmployeeViewModel,
    isFirstMeet: order.isFirstMeeting,
    dateFrom: order.dateFrom.getTime(),
    dateTo: order.dateTo.getTime(),
    // createdAt: order.createdAt.getTime(),
  };
}
