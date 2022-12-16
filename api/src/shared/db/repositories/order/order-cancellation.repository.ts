import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { OrderCancellationEntity } from '@pawfect/db/entities';
import { OrderCancellationEnum } from '@pawfect/db/entities/enums';

@EntityRepository(OrderCancellationEntity)
export class OrderCancellationRepository extends Repository<OrderCancellationEntity> {
  async getCanceledOrdersAsAdmin(
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<OrderCancellationEntity>> {
    const query = this.createQueryBuilder('CanceledOrders')
      .where('CanceledOrders.type = :type', {
        type: OrderCancellationEnum.CUSTOMER,
      })
      .andWhere('CanceledOrders.status = :status', {
        status: 0,
      })
      .leftJoinAndMapOne(
        'CanceledOrders.order',
        'Orders',
        'Orders',
        'CanceledOrders.orderId = Orders.id',
      )
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerAvatar',
        'Customers.avatarId = CustomerAvatar.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'Photos',
        'Pets.photoId = Photos.id',
      );

    return await paginate(query, paginationRequest);
  }
}
