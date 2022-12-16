import { EmployeeEntity } from "@pawfect/db/entities";


export interface EmployeeViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
}


export async function makeEmployeeViewModel(employeeEntity: EmployeeEntity): Promise<EmployeeViewModel> {
  const employeePhoto = await employeeEntity.avatar;

  return {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: employeePhoto?.url || null,
  };
}
