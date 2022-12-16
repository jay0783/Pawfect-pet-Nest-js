import { EmployeeEntity } from "@pawfect/db/entities";
import { EmployeeStatusEnum } from "@pawfect/db/entities/enums";
import { PaginationResponse } from "@pawfect/models";


export interface GetEmployeesForOrderResponse extends PaginationResponse<EmployeeViewModel> { }


export interface EmployeeViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  workTimeFrom: number;
  workTimeTo: number;
  status: EmployeeStatusEnum;
}


export async function makeEmployeeViewModel(employeeEntity: EmployeeEntity): Promise<EmployeeViewModel> {
  const avatar = await employeeEntity.avatar;

  const viewModel: EmployeeViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: avatar?.url || null,
    workTimeFrom: employeeEntity.workTimeFrom,
    workTimeTo: employeeEntity.workTimeTo,
    status: EmployeeStatusEnum.AVAILABLE
  };

  return viewModel;
}
