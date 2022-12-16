import { CustomerEntity, EmployeeRatingEntity, PhotoEntity } from "@pawfect/db/entities";


export interface EmployeeRateCommentViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  rating: number;
  comment: string | null;
}


export async function makeEmployeeRateCommentViewModel(employeeRatingEntity: EmployeeRatingEntity): Promise<EmployeeRateCommentViewModel> {
  const customerEntity: CustomerEntity = await employeeRatingEntity.customer;
  const customerAvatarEntity: PhotoEntity | undefined = await customerEntity.avatar;

  const commentViewModel: EmployeeRateCommentViewModel = {
    id: employeeRatingEntity.id,
    name: customerEntity.name,
    surname: customerEntity.surname,
    imageUrl: customerAvatarEntity?.url || null,
    rating: employeeRatingEntity.rating,
    comment: employeeRatingEntity.comment || null
  };

  return commentViewModel;
}