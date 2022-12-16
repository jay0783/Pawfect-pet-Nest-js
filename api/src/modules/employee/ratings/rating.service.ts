import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EmployeeEntity } from '@pawfect/db/entities';
import { EmployeeRatingRepository } from '@pawfect/db/repositories';
import {
  GetMyRatingsResponse, GetMyTotalRatingResponse, makeRatingViewModel,
} from './models';


@Injectable()
export class RatingService {

  constructor(private readonly employeeRatingRepository: EmployeeRatingRepository) {
  }

  async getMyTotalRating(employeeEntity: EmployeeEntity): Promise<GetMyTotalRatingResponse> {
    return { totalRating: employeeEntity.rating };
  }

  async getMyRatings(employeeEntity: EmployeeEntity, paginationOpt: IPaginationOptions): Promise<GetMyRatingsResponse> {
    const employeeRatings = await this.employeeRatingRepository.getEmployeeRatingsAsEmployee(employeeEntity.id, paginationOpt);
    const ratingsViewModels = employeeRatings.items.map((rating) => makeRatingViewModel(rating));
    const items = await Promise.all(ratingsViewModels);

    return {
      items: items,
      meta: employeeRatings.meta
    };
  }
}
