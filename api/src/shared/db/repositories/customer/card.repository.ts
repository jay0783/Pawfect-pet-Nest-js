import { EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  CustomerComingEntity,
  CustomerEmergencyContactEntity,
  CustomerBankCardEntity,
  CustomerHomeInfoEntity,
  PhotoEntity,
} from '@pawfect/db/entities';
import { UpsertCustomerOptions, UpsertCustomerRelations } from './interfaces';
@EntityRepository(CustomerBankCardEntity)
export class CardRepository extends Repository<CustomerBankCardEntity> {
  async getAllAsCustomer(
    customerId: string,
    paginationOpt: IPaginationOptions,
  ): Promise<Pagination<CustomerBankCardEntity>> {
    const query = this.createQueryBuilder('cards')
      .where('cards.customerId = :customerId', { customerId })
      .orderBy('cards.createdAt', 'DESC');

    const paginatecards = await paginate(query, paginationOpt);
    return paginatecards;
  }
}
