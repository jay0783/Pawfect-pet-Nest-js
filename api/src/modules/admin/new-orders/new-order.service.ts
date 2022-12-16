import { EntityManager } from 'typeorm';
import Decimal from 'decimal.js';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { OrderCancellationEntity, OrderEntity } from '@pawfect/db/entities';
import {
  MainOrderStatusEnum,
  OrderCancellationEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';
import { OrderRepository } from '@pawfect/db/repositories';
import { TransactionManager } from '@pawfect/db/services';
import {
  CancelNewOrderRequest,
  GetNewOrderDetailsResponse,
  GetNewOrdersResponse,
  makeCustomerViewModel,
  makePetViewModel,
  makeOrderViewModel,
  NewOrderViewModel,
  makeServiceViewModel,
  makeEmployeeViewModel,
} from './models';
import { DateTime } from 'luxon';

@Injectable()
export class NewOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly appTransactionManager: TransactionManager,
  ) {}

  async getNewOrders(
    paginationRequest: PaginationRequest,
    days: number,
  ): Promise<GetNewOrdersResponse> {
    let today = DateTime.utc();
    const date = today
      .plus({ day: days })
      .set({ hour: 23, minute: 59 })
      .toJSDate();

    const newOrdersEntities = await this.orderRepository.getNewOrdersAsAdmin(
      paginationRequest,
      date,
    );

    const newOrdersViewModelsPromises = newOrdersEntities.items.map(
      async (orderEntity) => {
        const mainOrderEntity = await orderEntity.mainOrder;
        const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;

        const [customerEntity, petEntities] = await Promise.all([
          mainOrderEntity.customer,
          mainOrderEntity.pets,
        ]);

        const petsViewModelsPromises = petEntities.map((petEntity) =>
          makePetViewModel(petEntity),
        );
        const [
          customerViewModel,
          orderViewModel,
          petsViewModels,
        ] = await Promise.all([
          makeCustomerViewModel(customerEntity),
          makeOrderViewModel(orderEntity),
          Promise.all(petsViewModelsPromises),
        ]);

        const extraServices = new Array<{ name: string; price: number }>();
        for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
          const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

          const extraViewModel = {
            name: extraServiceEntity.title,
            price: mainOrderExtraServiceEntity.price,
          };
          extraServices.push(extraViewModel);
        }

        return <NewOrderViewModel>{
          customer: customerViewModel,
          order: orderViewModel,
          pets: petsViewModels,
          extras: extraServices,
        };
      },
    );
    const newOrdersViewModels = await Promise.all(newOrdersViewModelsPromises);

    return { items: newOrdersViewModels, meta: newOrdersEntities.meta };
  }

  async cancelNewOrder(
    orderId: string,
    cancelNewOrderRequest: CancelNewOrderRequest,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.PENDING },
      relations: ['mainOrder', 'mainOrder.customer'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found', orderId);
    }

    orderEntity.status = OrderStatusEnum.CANCELED;
    orderEntity.reasonForCancel = 'Order Rejected!';
    await this.orderRepository.save(orderEntity);
    const orderCancellationEntity = new OrderCancellationEntity();
    orderCancellationEntity.reason = cancelNewOrderRequest.reason;
    orderCancellationEntity.order = Promise.resolve(orderEntity);
    orderCancellationEntity.type = OrderCancellationEnum.ADMIN;

    const mainOrderEntity = await orderEntity.mainOrder;
    const customerEntity = await mainOrderEntity.customer;
    const orderViewModels = await mainOrderEntity.orders;
    mainOrderEntity.totalAmount = +new Decimal(mainOrderEntity.totalAmount)
      .minus(orderEntity.priceWithExtras)
      .toFixed(2);

    customerEntity.balance = +new Decimal(customerEntity.balance)
      .plus(orderEntity.priceWithExtras)
      .toFixed(2);

    //checks if all the new orders status in the main-order is canceled
    const canceledAll = orderViewModels.every((item) => {
      return item['status'] == 'canceled';
    });
    if (canceledAll) {
      mainOrderEntity.status = MainOrderStatusEnum.CANCELED; //updates the main-order status, based on the new orders in the main-order
    }

    await this.appTransactionManager.execWithTransaction(
      async (entityManager: EntityManager) => {
        await Promise.all([
          entityManager.save(orderEntity),
          entityManager.save(orderCancellationEntity),
          entityManager.save(mainOrderEntity),
          entityManager.save(customerEntity),
        ]);
      },
    );

    return new SuccessModel();
  }

  async getNewOrderDetails(
    orderId: string,
  ): Promise<GetNewOrderDetailsResponse> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'mainOrder',
        'mainOrder.customer',
        'mainOrder.customer.avatar',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
        'mainOrder.mainOrderPets.pet.photo',
        'service',
        'service.logo',
        'employee',
      ],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const mainOrderEntity = await orderEntity.mainOrder;
    const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;

    const extraServices = new Array<{ name: string; price: number }>();
    for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
      const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

      const extraViewModel = {
        name: extraServiceEntity.title,
        price: mainOrderExtraServiceEntity.price,
      };
      extraServices.push(extraViewModel);
    }
    if (await orderEntity.employee) {
      const [petEntities, serviceEntity, employee] = await Promise.all([
        mainOrderEntity.pets,
        orderEntity.service,
        orderEntity.employee,
      ]);

      const petsViewModelsPromises = petEntities.map((petEntity) =>
        makePetViewModel(petEntity),
      );

      const [
        orderViewModel,
        serviceViewModel,
        petsViewModels,
        employeeViewModel,
      ] = await Promise.all([
        makeOrderViewModel(orderEntity),
        makeServiceViewModel(serviceEntity),
        Promise.all(petsViewModelsPromises),
        makeEmployeeViewModel(employee!),
      ]);

      const newOrderDetailsResponse: GetNewOrderDetailsResponse = {
        order: orderViewModel,
        pets: petsViewModels,
        service: serviceViewModel,
        employee: employeeViewModel,
        extras: extraServices,
      };

      return newOrderDetailsResponse;
    } else {
      const [petEntities, serviceEntity] = await Promise.all([
        mainOrderEntity.pets,
        orderEntity.service,
      ]);

      const petsViewModelsPromises = petEntities.map((petEntity) =>
        makePetViewModel(petEntity),
      );

      const [
        orderViewModel,
        serviceViewModel,
        petsViewModels,
      ] = await Promise.all([
        makeOrderViewModel(orderEntity),
        makeServiceViewModel(serviceEntity),
        Promise.all(petsViewModelsPromises),
      ]);

      const newOrderDetailsResponse: GetNewOrderDetailsResponse = {
        order: orderViewModel,
        pets: petsViewModels,
        service: serviceViewModel,
        employee: null,
        extras: extraServices,
      };

      return newOrderDetailsResponse;
    }
  }
}
