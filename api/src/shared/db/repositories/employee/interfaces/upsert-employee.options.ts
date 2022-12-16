import { UserEntity, ZipCodeEntity } from '@pawfect/db/entities';

export interface UpsertEmployeeOptions {
  name: string;
  surname: string;
  phoneNumber: string;
  homeAddress: string;
  workTimeFrom: number;
  workTimeTo: number;
  jobRate: number;
}

export interface UpsertEmployeeRelations {
  userEntity?: UserEntity;
  zipCodeEntity?: ZipCodeEntity;
}
