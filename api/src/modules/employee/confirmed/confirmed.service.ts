import { Injectable, NotFoundException } from "@nestjs/common";

import { EmployeeEntity, OrderEntity } from "@pawfect/db/entities";
import { OrderRepository } from "@pawfect/db/repositories";
import { GetConfirmedOrdersRequest, GetConfirmedOrdersResponse, makeConfirmedOrderViewModel, GetConfirmedOrderDetailsResponse, makeGetConfirmedOrderDetails } from "./models";


@Injectable()
export class ConfirmedService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) { }


  async getConfirmedOrders(employeeEntity: EmployeeEntity, paginationOptions: GetConfirmedOrdersRequest): Promise<GetConfirmedOrdersResponse> {
    const paginateOrders = await this.orderRepository.getConfirmedOrdersAsEmployee(employeeEntity.id, paginationOptions);
    const confirmedOrdersPromises = paginateOrders.items.map(async orderEntity => makeConfirmedOrderViewModel(orderEntity));
    const confirmedOrders = await Promise.all(confirmedOrdersPromises);
    return { items: confirmedOrders, meta: paginateOrders.meta };
  }


  async getConfirmedOrderDetails(employeeEntity: EmployeeEntity, orderId: string): Promise<GetConfirmedOrderDetailsResponse> {
    const orderEntity: OrderEntity | undefined = await this.orderRepository.findOne({
      where: { id: orderId, employee: employeeEntity.id },
      relations: [
        "mainOrder",
        "mainOrder.mainOrderPets", "mainOrder.mainOrderPets.pet", "mainOrder.mainOrderPets.pet.photo",
        "service", "service.logo",
        "mainOrder.customer", "mainOrder.customer.avatar"
      ]
    });

    if (!orderEntity) {
      throw new NotFoundException("Order was not found!");
    }

    const response = await makeGetConfirmedOrderDetails(orderEntity);
    return response;
  }
}
