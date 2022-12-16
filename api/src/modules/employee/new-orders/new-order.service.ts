import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import {
  EmployeeEntity,
  NotificationEntity,
  OrderEntity,
} from '@pawfect/db/entities';
import {
  NotificationFlagRepository,
  NotificationRepository,
  OrderRepository,
} from '@pawfect/db/repositories';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  GetNewOrderDetailsResponse,
  GetNewOrdersResponse,
  makeNewOrderDetailsViewModel,
  makeNewOrderViewModel,
  NotificationRequest,
} from './models';

let FCM = require('fcm-node');
// let fcm = new FCM(process.env.SERVERKEY);
let fcm = new FCM(
  'AAAA1YrCm5M:APA91bG21e-8cm8f-hWN6zSzv-tzgsYZFVoVaQmdWsBuiVIB157QiOPRJm5OKZ5V0jukwH7lFKmlxg0oUH1de0Q_2QeSTGP14zZBQOcVn-4VcLIKr2AcWAyYumJirLWuyGuN5PEC2i7g',
);
@Injectable()
export class NewOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly notificationFlagRepository: NotificationFlagRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async SendNotification(notification: NotificationRequest) {
    let userData: any;
    userData = await this.notificationFlagRepository.findOne({
      where: {
        customer: notification.customer,
      },
      relations: ['customer'],
    });
    // console.log('userData', userData);

    if (userData) {
      let count = 0;
      let deviceData: any;
      if (userData['push']) {
        deviceData = {
          token: await (await userData.customer).deviceToken,
          type: await (await userData.customer).deviceType,
        };

        // Store Notification
        const notificationEntity = new NotificationEntity();
        notificationEntity.itemId = notification.itemId;
        notificationEntity.isRead = false;
        notificationEntity.title = notification.notificationTitle!;
        notificationEntity.message = notification.notificationMsg!;
        notificationEntity.customer = await (await userData.customer).id;
        await this.notificationRepository.save(notificationEntity);

        //count notification
        count = await this.notificationRepository.count({
          where: {
            customer: await (await userData.customer).id,
            isRead: false,
          },
        });

        // Payload for push notificatin
        let notificationPayload = {
          deviceData: deviceData,
          title: notificationEntity.title,
          body: notification.body,
          itemId: notification.itemId,
          sound: 'default',
          badge: count,
        };

        this.SendPushNotification(notificationPayload);
      }
    }
  }

  async SendPushNotification(data: any) {
    let count = data.badge;
    var message = {
      to: data.deviceData['token'],
      notification: {
        title: data.title,
        body: data.body,
        item_id: data.itemId,
        sound: 'default',
        badge: count,
      },
      data: {
        item_id: data.itemId,
        message: data.body,
        contentAvailable: false,
      },
    };

    fcm.send(message, function (err: any, response: any) {
      // console.log('123', message, response);
      if (err) {
        console.log('push error==========>', err);
        console.log('Something has gone wrong!');
      } else {
        console.log('Successfully sent with response: ', response);
      }
    });
  }

  async getNewOrders(
    employeeEntity: EmployeeEntity,
    paginationOptions: PaginationRequest,
  ): Promise<GetNewOrdersResponse> {
    const orderEntities = await this.orderRepository.getNewOrdersByEmployeeAsEmployee(
      employeeEntity.id,
      paginationOptions,
    );

    const newOrderViewModelsPromises = orderEntities.items.map((orderEntity) =>
      makeNewOrderViewModel(orderEntity),
    );
    const newOrderViewModels = await Promise.all(newOrderViewModelsPromises);

    return { items: newOrderViewModels, meta: orderEntities.meta };
  }

  async acceptOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.PENDING,
      },
      relations: ['mainOrder', 'mainOrder.customer'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }
    console.log('orderEntity', orderEntity);

    orderEntity.status = OrderStatusEnum.CONFIRMED;
    orderEntity.isEmployeeAccepted = true;

    await this.orderRepository.save(orderEntity);

    let obj = {
      title: 'Order Details',
      body: 'Your order has been CONFIRMED',
      notificationTitle: 'CONFIRMED',
      notificationMsg: 'Your order has been CONFIRMED',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    // console.log(obj);

    this.SendNotification(obj);
    return new SuccessModel();
  }

  async getNewOrderDetails(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<GetNewOrderDetailsResponse> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.PENDING,
      },
      relations: [
        'mainOrder',
        'mainOrder.customer',
        'mainOrder.customer.avatar',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
        'mainOrder.mainOrderPets.pet.photo',
        'service',
        'service.logo',
      ],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const newOrderDetailsViewModel: GetNewOrderDetailsResponse = await makeNewOrderDetailsViewModel(
      orderEntity,
    );

    return newOrderDetailsViewModel;
  }

  async cancelOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.PENDING,
      },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    orderEntity.employee = Promise.resolve(null);
    orderEntity.status = OrderStatusEnum.CANCELED;
    orderEntity.isEmployeeAccepted = false;
    orderEntity.reasonForCancel = 'Order Rejected!';
    await this.orderRepository.save(orderEntity);

    let obj = {
      title: 'Order Details',
      body: 'Your order has been CANCELED',
      notificationTitle: 'CANCELED',
      notificationMsg: 'Your order has been CANCELED',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);

    return new SuccessModel();
  }
}
