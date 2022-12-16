import { DateTime } from 'luxon';
import { CustomerEntity, PetEntity } from '@pawfect/db/entities';
import { CustomerTransactionEnum } from '../../../entities/customer/enums';

export interface SaveMainOrderTransactionOptions {
  amount: number;
  type: CustomerTransactionEnum;
}

export interface SaveMainOrderTransactionRelations {
  pet: PetEntity;
  customer: CustomerEntity;
}
