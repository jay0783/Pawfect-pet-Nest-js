import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomerEntity } from "@pawfect/db/entities";
import { OrderStatusEnum } from "@pawfect/db/entities/enums";
import { OrderRepository } from "@pawfect/db/repositories";
import { PaginationRequest } from "@pawfect/models";
import { GetHistoryDetailsResponse, GetOrdersResponse, makeOrderViewModel, makeGetHistoryDetailsResponse } from "./models";


@Injectable()
export class HistoryService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) { }


  async getMyHistories(customerEntity: CustomerEntity, paginationRequest: PaginationRequest): Promise<GetOrdersResponse> {
    const paginationOrders = await this.orderRepository.getMyHistoriesAsCustomer(customerEntity.id, paginationRequest);


    const orderViewModelsPromises = paginationOrders.items.map(async order => makeOrderViewModel(order));
    const orderViewModels = await Promise.all(orderViewModelsPromises);

    return { items: orderViewModels, meta: paginationOrders.meta };
  }


  async getHistoryDetails(customerEntity: CustomerEntity, orderId: string): Promise<GetHistoryDetailsResponse> {
    const orderEntity = await this.orderRepository.getHistoryDetailsAsCustomer(orderId, customerEntity.id);

    if (!orderEntity) {
      throw new NotFoundException("Order was not found!");
    }

    const orderViewModel = await makeGetHistoryDetailsResponse(orderEntity);
    return orderViewModel;
  }

}
