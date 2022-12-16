import { CustomerEntity, EmployeeEntity, ZipCodeEntity } from '@pawfect/db/entities';


export interface RemovableZipCodeEntity extends ZipCodeEntity {
  employee?: EmployeeEntity;
  customer?: CustomerEntity;
}
