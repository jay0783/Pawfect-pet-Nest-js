import {
  MainOrderStatusEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';
import {
  OrderViewModel,
  PetViewModel,
  ServiceViewModel,
  VisitViewModel,
} from '.';
import { ExtraServiceViewModel } from '../../pet-services/models';

export interface ExtraOrderViewModel {
  id: string;
  firstDate: number;
  //   lastDate: number;
  extra: ExtraServiceViewModel;
  status: OrderStatusEnum;
}
