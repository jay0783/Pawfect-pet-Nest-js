import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  CustomerRepository,
  OrderCancellationRepository,
  RefundRepository,
} from '@pawfect/db/repositories';
import {
  CustomerEntity,
  OrderCancellationEntity,
  OrderRefundEntity,
} from '@pawfect/db/entities';
import {
  CanceledOrderViewModel,
  GetCanceledOrdersResponse,
  makeCustomerViewModel,
  makeOrderViewModel,
  makePetViewModel,
  RefundInfoResponse,
  RefundRequest,
} from './models';

@Injectable()
export class CanceledOrderService {
  constructor(
    private readonly orderCancellationRepository: OrderCancellationRepository,
    private readonly refundRepository: RefundRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getCanceledOrders(
    paginationRequest: PaginationRequest,
  ): Promise<GetCanceledOrdersResponse> {
    const {
      items,
      meta,
    } = await this.orderCancellationRepository.getCanceledOrdersAsAdmin(
      paginationRequest,
    );
    console.log('----------', items);

    let order = await this.orderCancellationRepository.findOne({
      where: {
        order: 'da00e921-23e4-4eef-9b44-e06b7c108233',
      },
    });
    console.log('-=-==--@@@@@@@-------', order);

    const ordersViewModelsPromise: Promise<CanceledOrderViewModel>[] = items.map(
      async (orderCancellationEntity: OrderCancellationEntity) => {
        const orderEntity = await orderCancellationEntity.order;
        const mainOrderEntity = await orderEntity.mainOrder;
        const customerEntity = await mainOrderEntity.customer;
        const petEntities = await mainOrderEntity.pets;

        const customerViewModel = await makeCustomerViewModel(customerEntity);
        const orderViewModel = await makeOrderViewModel(
          orderCancellationEntity,
        );
        const petsViewModelsPromises = petEntities.map((pet) =>
          makePetViewModel(pet),
        );
        const petsViewModels = await Promise.all(petsViewModelsPromises);

        return <CanceledOrderViewModel>{
          customer: customerViewModel,
          order: orderViewModel,
          pets: petsViewModels,
        };
      },
    );
    const ordersViewModels = await Promise.all(ordersViewModelsPromise);

    return { items: ordersViewModels, meta: meta };
  }

  async getRefundInfo(orderId: string): Promise<RefundInfoResponse> {
    const orderCancellationEntity = await this.orderCancellationRepository.findOne(
      {
        where: { order: orderId },
        relations: ['order'],
      },
    );
    if (!orderCancellationEntity) {
      throw new NotFoundException('Order cancellation not found');
    }

    const refundAmount = await orderCancellationEntity.maxRefundAmount;

    let refund = await this.refundRepository.findOne({
      where: {
        order: orderId,
      },
    });

    const fixedRefundAmount: number =
      +refundAmount.toFixed(2) - refund?.amount!;

    return <RefundInfoResponse>{
      maxRefund: fixedRefundAmount,
    };
  }

  async refundOrder(
    refunfRequest: RefundRequest,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderCancellationEntity = await this.orderCancellationRepository.findOne(
      {
        where: { order: orderId },
        relations: ['order'],
      },
    );
    console.log('--------', orderCancellationEntity);

    if (!orderCancellationEntity) {
      throw new NotFoundException('Order cancellation not found');
    }

    //Save order in refund
    const newOrderRefundEntity: OrderRefundEntity = new OrderRefundEntity();
    (newOrderRefundEntity.type = refunfRequest.type),
      (newOrderRefundEntity.amount = refunfRequest.amount),
      (newOrderRefundEntity.order = orderCancellationEntity.order),
      (newOrderRefundEntity.customer = (
        await (await orderCancellationEntity.order).mainOrder
      ).customer),
      await this.refundRepository.save(newOrderRefundEntity);

    //Add into Customer Balance
    const customerEntity: CustomerEntity | undefined = await (
      await (await orderCancellationEntity.order).mainOrder
    ).customer;

    customerEntity.balance = customerEntity.balance + refunfRequest.amount;
    await this.customerRepository.save(customerEntity);

    //change statius
    orderCancellationEntity.status = 1;
    await this.orderCancellationRepository.save(orderCancellationEntity);
    return new SuccessModel();
  }
}
