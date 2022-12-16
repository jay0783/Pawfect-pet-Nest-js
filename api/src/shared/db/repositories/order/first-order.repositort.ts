import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityRepository, In, Repository } from 'typeorm';
import { FreeOrderEntity } from '../../entities';
import { SaveFirstOrderOptions, SaveFirstOrderRelations } from './interfaces';

@EntityRepository(FreeOrderEntity)
export class FirstOrderRepository extends Repository<FreeOrderEntity> {
  async saveFirstOrder(
    saveFirstOrderOptions: SaveFirstOrderOptions,
    relations: SaveFirstOrderRelations,
  ): Promise<FreeOrderEntity> {
    const newMainOrder = new FreeOrderEntity();
    newMainOrder.dateFrom = new Date(saveFirstOrderOptions.dateFrom);
    newMainOrder.status = OrderStatusEnum.PENDING;
    newMainOrder.customer = Promise.resolve(relations.customer);
    newMainOrder.extra = Promise.resolve(relations.extra);

    await this.save(newMainOrder);
    return newMainOrder;
  }

  async getFirstNewOrdersAsAdmin(
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<FreeOrderEntity>> {
    const query = this.createQueryBuilder('FreeOrders')
      .where('FreeOrders.status = :status', { status: OrderStatusEnum.PENDING })
      .leftJoinAndMapOne(
        'FreeOrders.employee',
        'Employees',
        'Employees',
        'FreeOrders.employeeId = Employees.id',
      )
      .leftJoinAndMapOne(
        'FreeOrders.extra',
        'ExtraServices',
        'ExtraServices',
        'FreeOrders.extraId = ExtraServices.id',
      )
      .innerJoinAndMapOne(
        'FreeOrders.customer',
        'Customers',
        'Customers',
        'FreeOrders.customerId = Customers.id',
      )
      .orderBy({ 'FreeOrders.updatedAt': 'DESC' });
    return paginate(query, paginationRequest);
  }

  async getNewOrdersByEmployeeAsEmployee(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<FreeOrderEntity>> {
    return paginate(this, paginationOptions, {
      where: {
        employee: employeeId,
        status: In([OrderStatusEnum.PENDING, OrderStatusEnum.CONFIRMED]),
      },
      order: {
        createdAt: 'DESC',
      },
      // relations: ['FreeOrders', 'FreeOrders.customer', 'FreeOrders.extra'],OrderStatusEnum.PENDING
    });
  }

  async getCancelOrder(
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<FreeOrderEntity>> {
    const query = this.createQueryBuilder('FreeOrders')
      .where('FreeOrders.status = :status', {
        status: OrderStatusEnum.CANCELED,
      })
      .leftJoinAndMapOne(
        'FreeOrders.employee',
        'Employees',
        'Employees',
        'FreeOrders.employeeId = Employees.id',
      )
      .leftJoinAndMapOne(
        'FreeOrders.extra',
        'ExtraServices',
        'ExtraServices',
        'FreeOrders.extraId = ExtraServices.id',
      )
      .innerJoinAndMapOne(
        'FreeOrders.customer',
        'Customers',
        'Customers',
        'FreeOrders.customerId = Customers.id',
      )
      .orderBy({ 'FreeOrders.updatedAt': 'DESC' });
    return paginate(query, paginationRequest);
  }
}
