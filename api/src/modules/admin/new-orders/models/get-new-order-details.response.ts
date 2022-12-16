import { ServiceViewModel } from './service.vm';
import { OrderViewModel } from './order.vm';
import { PetViewModel } from './pet.vm';
import { EmployeeViewModel } from './employee.vm';

export interface GetNewOrderDetailsResponse {
  pets: Array<PetViewModel>;
  order: OrderViewModel;
  service: ServiceViewModel;
  employee: EmployeeViewModel | null;
  extras: Array<extrasModel>;
}

export interface extrasModel {
  name: string;
  price: number;
}
