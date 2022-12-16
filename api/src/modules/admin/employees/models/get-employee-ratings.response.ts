import { EmployeeEntity, EmployeeRatingEntity } from "@pawfect/db/entities";
import { PaginationResponse } from "@pawfect/models";


export interface GetEmployeeRatingsResponse extends PaginationResponse<EmployeeReviewViewModel> { }


export interface EmployeeReviewViewModel {
  customerId: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  rating: number;
  comment: string | null;
}


export async function makeEmployeeReviewViewModel(review: EmployeeRatingEntity): Promise<EmployeeReviewViewModel> {
  const customer = await review.customer;
  const avatar = await customer.avatar;

  const viewModel: EmployeeReviewViewModel = {
    customerId: customer.id,
    name: customer.name,
    surname: customer.surname,
    imageUrl: avatar?.url || null,
    rating: review.rating,
    comment: review.comment || null
  };
  return viewModel;
}
