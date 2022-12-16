import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { CustomerTransactionsEntity } from '../entities';
import {
  SaveMainOrderTransactionOptions,
  SaveMainOrderTransactionRelations,
} from './main-order/interfaces/save-transaction.options';

@EntityRepository(CustomerTransactionsEntity)
export class TransactionsRepository extends Repository<CustomerTransactionsEntity> {
  constructor(entityManager: EntityManager) {
    super();
  }

  async saveMainTransaction(
    saveMainTransactionOptions: SaveMainOrderTransactionOptions,
    relations: SaveMainOrderTransactionRelations,
  ): Promise<CustomerTransactionsEntity> {
    const newTransaction = new CustomerTransactionsEntity();
    newTransaction.amount = saveMainTransactionOptions.amount;
    newTransaction.type = saveMainTransactionOptions.type;

    newTransaction.customer = Promise.resolve(relations.customer);
    newTransaction.pet = Promise.resolve(relations.pet);

    await this.save(newTransaction);
    return newTransaction;
  }
}
