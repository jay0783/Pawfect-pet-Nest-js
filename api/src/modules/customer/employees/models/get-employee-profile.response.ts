import { EmployeeEntity, EmployeeRatingEntity, PhotoEntity } from "@pawfect/db/entities";
import { EmployeeRateCommentViewModel, makeEmployeeRateCommentViewModel } from "./employee-rate-comment.vm";


export interface GetEmployeeProfileResponse {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  rating: number;
  wasOrderRated: boolean;
  comments: Array<EmployeeRateCommentViewModel>;
}


export async function makeEmployeeProfileResponse(employeeEntity: EmployeeEntity, wasOrderRated: boolean): Promise<GetEmployeeProfileResponse> {
  const avatarEntity: PhotoEntity | undefined = await employeeEntity.avatar;
  const employeeCommentsEntities: Array<EmployeeRatingEntity> = await employeeEntity.employeeRatings;

  const commentsViewModelPromises: Array<Promise<EmployeeRateCommentViewModel>> = employeeCommentsEntities.map(comment => makeEmployeeRateCommentViewModel(comment));
  const commentsViewModel = await Promise.all(commentsViewModelPromises);

  const viewModel: GetEmployeeProfileResponse = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: avatarEntity?.url || null,
    rating: employeeEntity.rating,
    wasOrderRated: wasOrderRated,
    comments: commentsViewModel
  };


  return viewModel;
}
