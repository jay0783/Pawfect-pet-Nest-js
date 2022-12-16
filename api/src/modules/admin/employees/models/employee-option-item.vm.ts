import { EmployeeEntity } from "@pawfect/db/entities";


export interface EmployeeOptionItemViewModel {
  id: string;
  name: string;
  surname: string;
  workTimeFrom: number;
  workTimeTo: number;
  imageUrl: string | null;
}


export async function makeEmployeeOptionItemViewModel(employeeEntity: EmployeeEntity): Promise<EmployeeOptionItemViewModel> {
  const avatar = await employeeEntity.avatar;

  const viewModel: EmployeeOptionItemViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    workTimeFrom: employeeEntity.workTimeFrom,
    workTimeTo: employeeEntity.workTimeTo,
    imageUrl: avatar?.url || null
  };

  return viewModel;
}
