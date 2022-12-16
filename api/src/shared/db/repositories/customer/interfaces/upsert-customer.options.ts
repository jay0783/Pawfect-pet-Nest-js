import { GeoPositionModel } from '@pawfect/models';
import { UserEntity, ZipCodeEntity } from '@pawfect/db/entities';

export interface UpsertCustomerOptions {
  name: string;
  surname: string;
  phoneNumber: string;
  workPhoneNumber: string;
  homeAddress: string;
  homePosition: GeoPositionModel;
  billingAddress: string;
  city: string;
  state: string;
  comment?: string;
  status?: number;
  isSameAddress: boolean;
  deviceToken: string;
  deviceType: number;
}

export interface UpsertCustomerRelations {
  userEntity?: UserEntity;
  zipCodeEntity?: ZipCodeEntity;
}
