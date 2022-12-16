import { DateTime } from 'luxon';
import {
  CustomerEntity,
  ExtraServiceEntity,
  ServiceEntity,
} from '@pawfect/db/entities';
import {
  MainOrderStatusEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';

export interface SaveFirstOrderOptions {
  dateFrom: number;
  status: OrderStatusEnum;
}

export interface SaveFirstOrderRelations {
  customer: CustomerEntity;
  extra: ExtraServiceEntity;
}
