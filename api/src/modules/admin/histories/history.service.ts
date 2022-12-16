import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderRepository } from '@pawfect/db/repositories';
import { PaginationRequest } from '@pawfect/models';
import {
  GetHistoryOrderDetailsResponse,
  GetHistoryOrdersResponse,
  makeGetHistoryOrderDetailsResponse,
  makeHistoryOrderViewModel,
} from './models';

@Injectable()
export class HistoryService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getHistoryOrders(
    paginationRequest: PaginationRequest,
    name: PaginationRequest,
  ): Promise<GetHistoryOrdersResponse> {
    const paginateOrders = await this.orderRepository.getHistoryOrders(
      paginationRequest,
      name,
    );

    const orderViewModelsPromises = paginateOrders.items.map(async (order) =>
      makeHistoryOrderViewModel(order),
    );
    const ordersViewModels = await Promise.all(orderViewModelsPromises);

    return { items: ordersViewModels, meta: paginateOrders.meta };
  }

  async getHistoryOrderDetails(
    orderId: string,
  ): Promise<GetHistoryOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'employee',
        'employee.avatar',
        'mainOrder',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
        'mainOrder.mainOrderPets.pet.photo',
        'orderChecks',
        'orderChecks.logo',
        'orderChecks.attachments',
        'orderChecks.attachments.photo',
        'orderChecks.actions',
      ],
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const historyOrderViewModel = await makeGetHistoryOrderDetailsResponse(
      orderEntity,
    );
    return historyOrderViewModel;
  }
}
