import { EmployeeEntity } from "@pawfect/db/entities";


export interface EmployeeViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  rating: number;
}


export async function makeEmployeeViewModel(employeeEntity: EmployeeEntity): Promise<EmployeeViewModel> {
  const employeePhoto = await employeeEntity.avatar;

  const viewModel: EmployeeViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    rating: employeeEntity.rating,
    imageUrl: employeePhoto?.url || null
  };

  return viewModel;
}
