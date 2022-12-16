import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { OrderRepository } from '@pawfect/db/repositories';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import {
  GetConfirmedOrderDetailsResponse,
  GetDayScheduleResponse,
  GetOrderMapRequest,
  GetOrderMapResponse,
  GetOrderRequest,
  makeConfirmedOrderDetailsViewModel,
  makeScheduleItem,
} from './models';
import { DateTime } from 'luxon';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ScheduleOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrderMap(
    queryRequest: GetOrderMapRequest,
  ): Promise<GetOrderMapResponse> {
    const orders = await this.orderRepository.getByRange(
      queryRequest.startedDate,
      queryRequest.endedDate,
      OrderStatusEnum.IN_PROGRESS,
    );

    //Set hour min 0
    let ordersMap: GetOrderMapResponse = {};
    for (const order of orders) {
      let date = DateTime.fromJSDate(order.dateFrom).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      // console.log('before===>', date);

      // date = date.toUTC();
      // console.log('after===>', date);
      // console.log('===========>>>>>>>>>>>>>>>>>>>>>>', date);
      // console.log('=======bfjbdsfdskjfbfdsbfdsbfdsf', date.toUTC());

      let mapValue = ordersMap[date.toMillis()] || 0;
      mapValue++;

      ordersMap[date.toMillis()] = mapValue;
    }
    return ordersMap;
  }

  async getConfirmedOrderDetails(
    orderId: string,
  ): Promise<GetConfirmedOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.findOne(orderId, {
      relations: [
        'orderPayments',
        'mainOrder',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
        'mainOrder.mainOrderPets.pet.photo',
        'service',
        'service.logo',
        'employee',
        'employee.avatar',
      ],
    });
    console.log('orderEntity', orderEntity);
    if (
      !orderEntity ||
      (orderEntity!.status !== OrderStatusEnum.CONFIRMED &&
        orderEntity!.status !== OrderStatusEnum.IN_PROGRESS)
    ) {
      throw new NotFoundException('Order not found');
    }

    const orderEmployee = await orderEntity?.employee;
    if (!orderEmployee) {
      throw new InternalServerErrorException('Confirmed order has no employee');
    }

    return makeConfirmedOrderDetailsViewModel(orderEntity);
  }

  async getAllOrderMap(
    queryRequest: GetOrderRequest,
  ): Promise<GetDayScheduleResponse> {
    const orders = await this.orderRepository.getByDayRange(
      queryRequest.date,
      OrderStatusEnum.IN_PROGRESS,
    );
    const orderViewModelsPromises = new Array();
    for (const order of orders) {
      const orderViewModel = await makeScheduleItem(order);
      orderViewModelsPromises.push(orderViewModel);
    }
    const orderViewModels = await Promise.all(orderViewModelsPromises);

    return { items: orderViewModels };
  }
}
