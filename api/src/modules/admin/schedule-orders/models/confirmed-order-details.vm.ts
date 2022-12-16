import { OrderEntity } from '@pawfect/db/entities';
import { makePetViewModel, PetViewModel } from './pet.vm';
import { makeOrderViewModel, OrderViewModel } from './order.vm';
import { makeServiceViewModel, ServiceViewModel } from './service.vm';
import { makeEmployeeViewModel, EmployeeViewModel } from './employee.vm';

export interface ConfirmedOrderDetailsViewModel {
  pets: PetViewModel[];
  order: OrderViewModel;
  extras: Array<{ name: string; price: number }>;
  service: ServiceViewModel;
  employee: EmployeeViewModel | null;
}

export async function makeConfirmedOrderDetailsViewModel(
  order: OrderEntity,
): Promise<ConfirmedOrderDetailsViewModel> {
  const [mainOrder, serviceEntity, employeeEntity] = await Promise.all([
    order.mainOrder,
    order.service,
    order.employee,
  ]);

  // console.log('orderPayment', orderPayment);
  const petsEntities = await mainOrder.pets;

  const petsViewModelsPromises = petsEntities.map((pet) =>
    makePetViewModel(pet),
  );
  const [petsViewModels, orderViewModel, serviceViewModel] = await Promise.all([
    Promise.all(petsViewModelsPromises),
    makeOrderViewModel(order),
    makeServiceViewModel(serviceEntity),
  ]);
  const employeeViewModel = employeeEntity
    ? await makeEmployeeViewModel(employeeEntity)
    : null;

  const mainOrderExtraServiceEntities = await mainOrder.mainOrderExtras;

  const extraServices = new Array<{ name: string; price: number }>();
  for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
    const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

    const extraViewModel = {
      name: extraServiceEntity.title,
      price: mainOrderExtraServiceEntity.price,
    };
    extraServices.push(extraViewModel);
  }

  return {
    pets: petsViewModels,
    order: orderViewModel,
    service: serviceViewModel,
    employee: employeeViewModel,
    extras: extraServices,
  };
}
