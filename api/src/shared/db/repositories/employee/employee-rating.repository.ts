import { EntityRepository, Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

import { EmployeeRatingEntity } from '@pawfect/db/entities';


@EntityRepository(EmployeeRatingEntity)
export class EmployeeRatingRepository extends Repository<EmployeeRatingEntity> {

  async getEmployeeRatingsAsEmployee(employeeId: string, paginationOpt: IPaginationOptions): Promise<Pagination<EmployeeRatingEntity>> {
    const query = this.createQueryBuilder('Rating')
      .innerJoinAndMapOne("Rating.customer", "Customers", "customer", "Rating.customerId = customer.id")
      .where('Rating.employeeId = :employeeId', { employeeId: employeeId })
      .orderBy('Rating.createdAt', 'DESC');

    const paginateRatings = await paginate(query, paginationOpt);

    return paginateRatings;
  }

  async getEmployeeReviews(employeeId: string, paginationOptions: IPaginationOptions): Promise<Pagination<EmployeeRatingEntity>> {
    const ratings = await paginate(this, paginationOptions, {
      where: { employee: employeeId },
      relations: ["customer", "customer.avatar"]
    });

    return ratings;
  }
}
