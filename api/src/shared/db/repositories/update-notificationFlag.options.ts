import { CustomerEntity, EmployeeEntity } from '@pawfect/db/entities';

export interface UpsertNotificationOptions {
  push: boolean;
}
export interface UpsertNotificationRelations {
  customerEntity?: CustomerEntity;
  employeeEntity?: EmployeeEntity;
}
