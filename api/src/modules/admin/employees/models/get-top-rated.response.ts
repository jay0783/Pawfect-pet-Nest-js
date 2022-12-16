import { EmployeeEntity } from "@pawfect/db/entities";
import { PaginationResponse } from "@pawfect/models";


export interface GetTopRatedResponse extends PaginationResponse<TopEmployeeViewModel> {

}


export interface TopEmployeeViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  rating: number;
}


export async function makeTopEmployeeViewModel(employeeEntity: EmployeeEntity): Promise<TopEmployeeViewModel> {
  const avatar = await employeeEntity.avatar;

  const viewModel: TopEmployeeViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: avatar?.url || null,
    rating: employeeEntity.rating
  };

  return viewModel;
}
