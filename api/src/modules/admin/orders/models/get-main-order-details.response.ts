import { MainOrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderViewModel } from './order.vm';
import { PetViewModel } from './pet.vm';
import { ServiceViewModel } from './service.vm';
import { VisitViewModel } from './visit.vm';

export interface GetMainOrderDetailsResponse {
  id: string;
  firstDate: number;
  lastDate: number;
  status: MainOrderStatusEnum;
  comment?: string | null;
  pets: Array<PetViewModel>;
  service: ServiceViewModel;
  visits: Array<VisitViewModel>;
  orders: Array<OrderViewModel>;
  createdAt: number;
  total: {
    totalAmount: number;
    holidays: Array<{ date: number; price: number }>;
    extras: Array<{ name: string; price: number }>;
  };
}
