import { MainOrderStatusEnum } from '@pawfect/db/entities/enums';
import { PetViewModel } from '../../orders/models';

export interface GetOrderDetailsResponse {
  id: string;
  pets: Array<PetViewModel>;
  totalAmount: number;
  createdAt: number;
}
