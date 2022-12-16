import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationRequest } from '@pawfect/models';
import { CustomerEntity } from '@pawfect/db/entities';
import { OrderRepository } from '@pawfect/db/repositories';
import {
  GetOrdersResponse,
  makeOrderViewModel,
  GetOrderDetailsResponse,
  makeGetOrderDetailsResponse,
} from './models';
import { AppRedisService } from '@pawfect/libs/redis';

@Injectable()
export class MapService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly redisClient: AppRedisService,
  ) {}

  async getMapOrders(
    customerEntity: CustomerEntity,
    paginationRequest: PaginationRequest,
  ): Promise<GetOrdersResponse> {
    const paginationOrderEntities = await this.orderRepository.getMapOrdersAsCustomer(
      customerEntity.id,
      paginationRequest,
    );

    const makeMapOrdersViewModelsPromises = paginationOrderEntities.items.map(
      async (order) => makeOrderViewModel(order),
    );
    const mapOrdersViewModels = await Promise.all(
      makeMapOrdersViewModelsPromises,
    );
    return { items: mapOrdersViewModels, meta: paginationOrderEntities.meta };
  }

  async getOrderDetails(
    customerEntity: CustomerEntity,
    orderId: string,
  ): Promise<GetOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.getMapOrderDetailsAsCustomer(
      customerEntity.id,
      orderId,
    );
    console.log('--=-=', orderEntity);

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }
    const employee = await orderEntity.employee;
    console.log('--------', employee);

    const orderDetailsViewModel = await makeGetOrderDetailsResponse(
      orderEntity,
    );

    const [points, actionPoints] = await Promise.all([
      employee
        ? this.redisClient.getPoints(employee.id, orderId)
        : Promise.resolve([]),
      employee
        ? this.redisClient.getActionPoints(employee.id, orderId)
        : Promise.resolve([]),
    ]);

    orderDetailsViewModel.points = points;
    orderDetailsViewModel.actionPoints = actionPoints;
    return orderDetailsViewModel;
  }
}
