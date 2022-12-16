import { Injectable, NotFoundException } from "@nestjs/common";

import { EmployeeEntity } from "@pawfect/db/entities";
import { OrderRepository } from "@pawfect/db/repositories";
import { PaginationRequest } from "@pawfect/models";
import { GetOrdersResponse, makeOrderViewModel, GetHistoryDetailsResponse, makeGetHistoryDetailsResponse } from "./models";


@Injectable()
export class HistoryService {

  constructor(
    private readonly orderRepository: OrderRepository
  ) { }


  async getMyHistories(employeeEntity: EmployeeEntity, paginationRequest: PaginationRequest): Promise<GetOrdersResponse> {
    const paginationOrders = await this.orderRepository.getMyHistoriesAsEmployee(employeeEntity.id, paginationRequest);

    const orderViewModelsPromises = paginationOrders.items.map(async order => makeOrderViewModel(order));
    const orderViewModels = await Promise.all(orderViewModelsPromises);

    return { items: orderViewModels, meta: paginationOrders.meta };
  }


  async getHistoryDetails(employeeEntity: EmployeeEntity, orderId: string): Promise<GetHistoryDetailsResponse> {
    const orderEntity = await this.orderRepository.getHistoryDetailsAsEmployee(employeeEntity.id, orderId);
    if (!orderEntity) {
      throw new NotFoundException("Order was not found!");
    }

    const response = await makeGetHistoryDetailsResponse(orderEntity);
    return response;
  }
}
