import { EmployeeStatusEnum } from '@pawfect/db/entities/enums';

export interface EmployeeTableItem {
  id: string;
  name: string;
  surname: string;
  imageUrl?: string;
  rating: number;
  workTimeFrom: number;
  workTimeTo: number;
  phoneNumber: string;
  status: EmployeeStatusEnum;
}

export interface EmployeeDropdownList {
  id: string;
  name: string;
}
