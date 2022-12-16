import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderRepository } from '@pawfect/db/repositories';
import { CustomerEntity, OrderEntity } from '@pawfect/db/entities';
import {
  GetUpcomingOrderDetailsResponse,
  GetUpcomingOrdersRequest,
  GetUpcomingOrdersResponse,
  makeUpcomingOrderDetailsViewModel,
  makeUpcomingOrderViewModel,
} from './models';

@Injectable()
export class UpcomingService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getUpcomingOrders(
    customerEntity: CustomerEntity,
    paginationRequest: GetUpcomingOrdersRequest,
  ): Promise<GetUpcomingOrdersResponse> {
    const paginationOrders = await this.orderRepository.getUpcomingOrdersAsCustomer(
      customerEntity.id,
      paginationRequest.date,
      paginationRequest,
    );

    const ordersViewModelsPromises = paginationOrders.items.map((order) =>
      makeUpcomingOrderViewModel(order),
    );
    const orderViewModels = await Promise.all(ordersViewModelsPromises);

    return { items: orderViewModels, meta: paginationOrders.meta };
  }

  async getUpcomingOrderDetails(
    customerEntity: CustomerEntity,
    orderId: string,
  ): Promise<GetUpcomingOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.getUpcomingOrderDetailsAsCustomer(
      customerEntity.id,
      orderId,
    );
    if (!orderEntity) {
      throw new NotFoundException('Order not found');
    }

    return makeUpcomingOrderDetailsViewModel(orderEntity);
  }
}
