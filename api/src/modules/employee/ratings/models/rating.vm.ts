import { EmployeeRatingEntity } from '@pawfect/db/entities';


export interface RatingViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl?: string;
  rate: number;
  comment: string | null;
}

export async function makeRatingViewModel(entity: EmployeeRatingEntity): Promise<RatingViewModel> {
  const customer = await entity.customer;

  return {
    id: entity.id,
    name: customer.name,
    surname: customer.surname,
    rate: entity.rating,
    comment: entity.comment || null,
  };
}
