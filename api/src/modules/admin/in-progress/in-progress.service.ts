import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderRepository } from '@pawfect/db/repositories';
import { PaginationRequest } from '@pawfect/models';
import {
  GetOrdersResponse,
  makeOrderItemViewModel,
  GetOrderDetailsResponse,
  makeGetOrderDetailsResponse,
} from './models';

@Injectable()
export class InProgressService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getInProgressOrders(
    paginationRequest: PaginationRequest,
    name: PaginationRequest,
  ): Promise<GetOrdersResponse> {
    const paginateOrders = await this.orderRepository.getInProgressOrders(
      paginationRequest,
      name,
    );

    const orderViewModelsPromises = paginateOrders.items.map(async (pet) =>
      makeOrderItemViewModel(pet),
    );
    const orderViewModels = await Promise.all(orderViewModelsPromises);

    return { items: orderViewModels, meta: paginateOrders.meta };
  }

  async getInProgressOrderDetails(
    orderId: string,
  ): Promise<GetOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.getInProgressOrderDetails(
      orderId,
    );

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const orderDetailsResponse = await makeGetOrderDetailsResponse(orderEntity);
    return orderDetailsResponse;
  }
}
