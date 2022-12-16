import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import {
  EmployeeEntity,
  FreeOrderEntity,
  NotificationEntity,
  OrderEntity,
} from '@pawfect/db/entities';
import {
  FirstOrderRepository,
  NotificationFlagRepository,
  NotificationRepository,
  OrderRepository,
} from '@pawfect/db/repositories';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  GetFirstOrdersResponse,
  GetNewOrderDetailsResponse,
  makeNewOrderDetailsViewModel,
  makeNewOrderViewModel,
} from './models';
import { NotificationRequest } from '../new-orders/models';

let FCM = require('fcm-node');
// let fcm = new FCM(process.env.SERVERKEY);
let fcm = new FCM(
  'AAAA1YrCm5M:APA91bG21e-8cm8f-hWN6zSzv-tzgsYZFVoVaQmdWsBuiVIB157QiOPRJm5OKZ5V0jukwH7lFKmlxg0oUH1de0Q_2QeSTGP14zZBQOcVn-4VcLIKr2AcWAyYumJirLWuyGuN5PEC2i7g',
);
@Injectable()
export class FirstOrderService {
  constructor(
    private readonly firstOrderRepository: FirstOrderRepository,
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
  ): Promise<GetFirstOrdersResponse> {
    const orderEntities = await this.firstOrderRepository.getNewOrdersByEmployeeAsEmployee(
      employeeEntity.id,
      paginationOptions,
    );

    const newOrderViewModelsPromises = orderEntities.items.map((orderEntity) =>
      makeNewOrderViewModel(orderEntity),
    );
    const newOrderViewModels = await Promise.all(newOrderViewModelsPromises);

    return { items: newOrderViewModels, meta: orderEntities.meta };
  }

  async getNewOrderDetails(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<GetNewOrderDetailsResponse> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.PENDING,
      },
      relations: ['customer', 'extra'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const newOrderDetailsViewModel: GetNewOrderDetailsResponse = await makeNewOrderDetailsViewModel(
      orderEntity,
    );

    return newOrderDetailsViewModel;
  }

  async acceptOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.PENDING,
      },
      relations: ['customer'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    orderEntity.status = OrderStatusEnum.CONFIRMED;
    await this.firstOrderRepository.save(orderEntity);

    //notification
    let obj = {
      title: 'Meet And Greet',
      body: 'Your appointment has been CONFIRMED',
      notificationTitle: 'Meet And Greet',
      notificationMsg: 'Your appointment has been CONFIRMED',
      itemId: orderId,
      customer: (await orderEntity.customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async cancelOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
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
    await this.firstOrderRepository.save(orderEntity);
    var message;
    if (orderEntity.comment) {
      message = orderEntity.comment;
    } else {
      message = '';
    }
    let obj = {
      title: 'Meet And Greet',
      body: 'Your appointment has been CANCELED' + message,
      notificationTitle: 'Meet And Greet',
      notificationMsg: 'Your appointment has been CANCELED',
      itemId: orderId,
      customer: (await orderEntity.customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async finishedOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | FreeOrderEntity
      | undefined = await this.firstOrderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.CONFIRMED,
      },
      relations: ['customer'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }
    if (orderEntity.dateFrom <= new Date()) {
      orderEntity.status = OrderStatusEnum.COMPLETED;
      await this.firstOrderRepository.save(orderEntity);
    } else {
      throw new NotFoundException(
        'You can not complete an appointment.Please complete the consultancy first.!',
      );
    }

    //notification
    let obj = {
      title: 'Meet And Greet',
      body: 'Your appointment has been COMPLETED',
      notificationTitle: 'Meet And Greet',
      notificationMsg: 'Your appointment has been COMPLETED',
      itemId: orderId,
      customer: (await orderEntity.customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }
}
