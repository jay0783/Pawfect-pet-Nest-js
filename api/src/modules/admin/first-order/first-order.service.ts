import { EntityManager } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { DateTime } from 'luxon';

import {
  CustomerEntity,
  EmployeeEntity,
  ExtraServiceEntity,
  FreeOrderEntity,
  MainOrderPetEntity,
  OrderCancellationEntity,
  OrderEntity,
  PetEntity,
} from '@pawfect/db/entities';
import {
  OrderCancellationEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';
import {
  CustomerRepository,
  EmployeeRepository,
  FirstOrderRepository,
  MainOrderPetRepository,
  OrderRepository,
} from '@pawfect/db/repositories';
import { TransactionManager } from '@pawfect/db/services';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  FirstOrderViewModel,
  GetFirstOrdersResponse,
  makeCustomerViewModel,
  makeExtraViewModel,
  makeFirstOrderViewModel,
  SetOrderRequest,
  SetPayRequest,
} from './models';

@Injectable()
export class FirstOrderService {
  constructor(
    private readonly firstOrderRepository: FirstOrderRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly mainOrderPetRepository: MainOrderPetRepository,
    private readonly appTransactionManager: TransactionManager,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getFirstOrders(
    paginationRequest: PaginationRequest,
  ): Promise<GetFirstOrdersResponse> {
    const newOrdersEntities = await this.firstOrderRepository.getFirstNewOrdersAsAdmin(
      paginationRequest,
    );
    const newOrdersViewModelsPromises = newOrdersEntities.items.map(
      async (orderEntity) => {
        const [customerEntity, extraEntities] = await Promise.all([
          orderEntity.customer,
          orderEntity.extra,
        ]);

        const [
          customerViewModel,
          orderViewModel,
          ExtraViewModel,
        ] = await Promise.all([
          makeCustomerViewModel(customerEntity),
          makeFirstOrderViewModel(orderEntity),
          makeExtraViewModel(extraEntities),
        ]);

        return <FirstOrderViewModel>{
          customer: customerViewModel,
          order: orderViewModel,
          extras: extraEntities,
        };
      },
    );
    const newOrdersViewModels = await Promise.all(newOrdersViewModelsPromises);

    return { items: newOrdersViewModels, meta: newOrdersEntities.meta };
  }

  async setEmployeeFirstOrder(
    orderId: string,
    employeeId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.PENDING },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const employeeEntity:
      | EmployeeEntity
      | undefined = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new NotFoundException('Employee was not found!');
    }

    orderEntity.employee = Promise.resolve(employeeEntity);
    await this.firstOrderRepository.save(orderEntity);

    return new SuccessModel();
  }

  async cancelOrder(orderId: string): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.PENDING },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found', orderId);
    }

    orderEntity.status = OrderStatusEnum.CANCELED;
    await this.firstOrderRepository.save(orderEntity);
    return new SuccessModel();
  }

  async setOrder(
    orderId: string,
    setRequest: SetOrderRequest,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.PENDING },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    orderEntity.orderType = setRequest.type;
    orderEntity.status = OrderStatusEnum.CONFIRMED;
    await this.firstOrderRepository.save(orderEntity);
    return new SuccessModel();
  }

  async payOrder(
    orderId: string,
    customerId: string,
    setPayRequest: SetPayRequest,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.CONFIRMED, orderType: 2 },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    //Find Customer
    const customer:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    let balance = customer?.balance! - setPayRequest.amount;
    const customerEntity: CustomerEntity = await orderEntity.customer;
    customerEntity.balance = balance;
    await this.customerRepository.save(customerEntity);
    return new SuccessModel();
  }

  async getCancelOrders(
    paginationRequest: PaginationRequest,
  ): Promise<GetFirstOrdersResponse> {
    const newOrdersEntities = await this.firstOrderRepository.getCancelOrder(
      paginationRequest,
    );
    const newOrdersViewModelsPromises = newOrdersEntities.items.map(
      async (orderEntity) => {
        const [customerEntity, extraEntities] = await Promise.all([
          orderEntity.customer,
          orderEntity.extra,
        ]);

        const [
          customerViewModel,
          orderViewModel,
          ExtraViewModel,
        ] = await Promise.all([
          makeCustomerViewModel(customerEntity),
          makeFirstOrderViewModel(orderEntity),
          makeExtraViewModel(extraEntities),
        ]);

        return <FirstOrderViewModel>{
          customer: customerViewModel,
          order: orderViewModel,
          extras: extraEntities,
        };
      },
    );
    const newOrdersViewModels = await Promise.all(newOrdersViewModelsPromises);

    return { items: newOrdersViewModels, meta: newOrdersEntities.meta };
  }

  async CompleteOrders(orderId: string): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found', orderId);
    }

    orderEntity.status = OrderStatusEnum.COMPLETED;
    await this.firstOrderRepository.save(orderEntity);
    return new SuccessModel();
  }
}
