import { CustomerViewModel } from './customer.vm';
import { OrderViewModel } from './order.vm';
import { PetViewModel } from './pet.vm';


export interface CanceledOrderViewModel {
  customer: CustomerViewModel;
  order: OrderViewModel;
  pets: PetViewModel[];
}
