import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AwsS3Lib, FolderEnum } from '@pawfect/libs/aws-s3';
import { AppRedisService } from '@pawfect/libs/redis';
import { FileLib } from '@pawfect/libs/multer';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import {
  EmployeeEntity,
  EmployeePayrollEntity,
  NotificationEntity,
  OrderCheckActionEntity,
  OrderCheckAttachmentEntity,
  OrderCheckEntity,
} from '@pawfect/db/entities';
import {
  CustomerRepository,
  EmployeeRepository,
  FirstOrderRepository,
  NotificationFlagRepository,
  NotificationRepository,
  OrderCheckRepository,
  OrderRepository,
  PhotoRepository,
  UserRepository,
} from '@pawfect/db/repositories';
import { SuccessModel } from '@pawfect/models';
import {
  GetOrderDetailsResponse,
  GetOrdersResponse,
  makeOrderViewModel,
  makeGetOrderDetailsResponse,
  SavePositionRequest,
  SavedGeoPosition,
  SaveActionRequest,
  SaveTrackedTimeRequest,
  AttachPhotoRequest,
  AttachPhotoResponse,
  ActionPointViewModel,
} from './models';
import { NotificationRequest } from '../new-orders/models';
import {
  GetHistoryDetailsResponse,
  makeGetHistoryDetailsResponse,
} from './models/map.history';
import { EmailSenderService } from '@pawfect/libs/nodemailer';
import moment from 'moment';
let FCM = require('fcm-node');
// let fcm = new FCM(process.env.SERVERKEY);
let fcm = new FCM(
  'AAAA1YrCm5M:APA91bG21e-8cm8f-hWN6zSzv-tzgsYZFVoVaQmdWsBuiVIB157QiOPRJm5OKZ5V0jukwH7lFKmlxg0oUH1de0Q_2QeSTGP14zZBQOcVn-4VcLIKr2AcWAyYumJirLWuyGuN5PEC2i7g',
);
@Injectable()
export class MapService {
  constructor(
    private readonly awsClient: AwsS3Lib,
    private readonly redisClient: AppRedisService,
    private readonly orderRepository: OrderRepository,
    private readonly orderCheckRepository: OrderCheckRepository,
    private readonly photoRepository: PhotoRepository,
    @InjectRepository(OrderCheckActionEntity)
    private readonly orderCheckActionRepository: Repository<OrderCheckActionEntity>,
    @InjectRepository(OrderCheckAttachmentEntity)
    private readonly orderCheckAttachmentRepository: Repository<OrderCheckAttachmentEntity>,
    @InjectRepository(EmployeePayrollEntity)
    private readonly employeePayrollRepository: Repository<EmployeePayrollEntity>,
    private readonly employeeRepository: EmployeeRepository,
    private readonly firstOrderRepository: FirstOrderRepository,
    private readonly notificationFlagRepository: NotificationFlagRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly emailSenderService: EmailSenderService,
    private readonly userRepository: UserRepository,
  ) {}

  async SendNotification(notification: NotificationRequest) {
    let userData: any;
    userData = await this.notificationFlagRepository.findOne({
      where: {
        customer: notification.customer,
      },
      relations: ['customer'],
    });

    if (userData) {
      let count = 0;
      let deviceData: any;
      if (userData['push']) {
        deviceData = {
          token: await (await userData.customer).deviceToken,
          type: await (await userData.customer).deviceType,
        };

        // Store Notification
        // const notificationEntity = new NotificationEntity();
        // notificationEntity.itemId = notification.itemId;
        // notificationEntity.isRead = false;
        // notificationEntity.title = notification.notificationTitle!;
        // notificationEntity.message = notification.notificationMsg!;
        // notificationEntity.customer = await (await userData.customer).id;
        // await this.notificationRepository.save(notificationEntity);

        // Payload for push notificatin
        let notificationPayload = {
          deviceData: deviceData,
          title: notification.notificationTitle,
          body: notification.body,
          itemId: notification.itemId,
          sound: 'default',
          badge: 0,
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
        contentAvailable: true,
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

  async getMapOrders(
    employeeEntity: EmployeeEntity,
  ): Promise<GetOrdersResponse> {
    const ordersEntities = await this.orderRepository.getMapOrdersAsEmployee(
      employeeEntity.id,
    );
    const ordersViewModelsPromises = ordersEntities.map((orderEntity) =>
      makeOrderViewModel(orderEntity),
    );
    const ordersViewModels = await Promise.all(ordersViewModelsPromises);
    return { items: ordersViewModels };
  }

  async getMapOrderDetails(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<GetOrderDetailsResponse> {
    const orderEntity = await this.orderRepository.findOne({
      where: [
        {
          id: orderId,
          employee: employeeEntity.id,
          status: OrderStatusEnum.CONFIRMED,
        },
        {
          id: orderId,
          employee: employeeEntity.id,
          status: OrderStatusEnum.IN_PROGRESS,
        },
      ],
      relations: [
        'mainOrder',
        'mainOrder.customer',
        'employee',
        'employee.avatar',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
        'mainOrder.mainOrderPets.pet.photo',
        'orderChecks',
        'orderChecks.logo',
        'orderChecks.attachments',
        'orderChecks.attachments.photo',
      ],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const getOrderDetails = await makeGetOrderDetailsResponse(orderEntity);

    const [points, actionPoints] = await Promise.all([
      this.redisClient.getPoints(employeeEntity.id, orderId),
      this.redisClient.getActionPoints(employeeEntity.id, orderId),
    ]);

    getOrderDetails.points = points;
    getOrderDetails.actionPoints = <ActionPointViewModel[]>actionPoints;

    return getOrderDetails;
  }

  async toNextStage(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.getOrderWithChecklist(
      employeeEntity.id,
      orderId,
    );

    if (!orderEntity) {
      throw new NotFoundException('Order was not found');
    }

    const orderChecks = await orderEntity.orderChecks;

    //if start
    const firstOrderCheck = orderChecks[0];
    if (firstOrderCheck && !firstOrderCheck.dateStart) {
      firstOrderCheck.dateStart = DateTime.utc().toJSDate();
      await this.orderCheckRepository.save(firstOrderCheck);
      //notification
      let obj = {
        title: 'Employee Reached',
        body: '',
        notificationTitle: 'Employee Reached',
        notificationMsg: '',
        itemId: 'next',
        customer: (await (await orderEntity.mainOrder).customer).id,
      };
      this.SendNotification(obj);

      return new SuccessModel();
    }

    // if end
    // TODO: if end - create summary and clear redis
    const stageIndex = orderChecks.findIndex(
      (check) => check.dateEnd === null || check.dateEnd === undefined,
    );
    if (stageIndex < 0) {
      return new SuccessModel();
    }

    const filteredOrderChecks = orderChecks.slice(stageIndex);
    const firstCheckInOrder: OrderCheckEntity | undefined =
      filteredOrderChecks[0];
    const secondCheckInOrder: OrderCheckEntity | undefined =
      filteredOrderChecks[1];

    if (!firstCheckInOrder) {
      return new SuccessModel();
    }

    if (firstCheckInOrder.trackedDuration < firstCheckInOrder.duration) {
      throw new BadRequestException("Time hasn't been tracked");
    }

    firstCheckInOrder.dateEnd = DateTime.utc().toJSDate();
    await this.orderCheckRepository.save(firstCheckInOrder);

    if (secondCheckInOrder) {
      secondCheckInOrder.dateStart = DateTime.utc().toJSDate();
      await this.orderCheckRepository.save(secondCheckInOrder);
    }

    orderEntity.status = OrderStatusEnum.IN_PROGRESS;
    await this.orderRepository.save(orderEntity);

    await this.orderCheckRepository.save(firstOrderCheck);
    //notification
    let obj = {
      title: 'Employee Reached',
      body: '',
      notificationTitle: 'Employee Reached',
      notificationMsg: '',
      itemId: 'next',
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);

    return new SuccessModel();
  }

  async savePosition(
    employeeEntity: EmployeeEntity,
    orderId: string,
    savePositionRequest: SavePositionRequest,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId, employee: employeeEntity.id },
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const existPoints = await this.redisClient.getPoints(
      employeeEntity.id,
      orderId,
    );

    existPoints.push(...savePositionRequest.positions);
    const existPointsMap: Map<number, SavedGeoPosition> = existPoints.reduce(
      (map, value) => {
        map.set(value.createdAt, value);
        return map;
      },
      new Map<number, SavedGeoPosition>(),
    );

    await this.redisClient.setPoints(
      employeeEntity.id,
      orderId,
      Array.from(existPointsMap.values()),
    );

    //notification
    let obj = {
      title: 'Pet Position',
      body: '',
      notificationTitle: 'Pet Position',
      notificationMsg: '',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    // this.SendNotification(obj);

    return new SuccessModel();
  }

  async saveAction(
    employeeEntity: EmployeeEntity,
    orderId: string,
    saveActionRequest: SaveActionRequest,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId, employee: employeeEntity.id },
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const orderCheckEntity = await this.orderCheckRepository.findOne({
      where: { id: saveActionRequest.orderCheckId, order: orderId },
    });
    if (!orderCheckEntity) {
      throw new NotFoundException('Order check was not found!');
    }

    const newActionEntity = new OrderCheckActionEntity();
    newActionEntity.name = saveActionRequest.name;
    newActionEntity.time = new Date(saveActionRequest.createdAt);
    newActionEntity.orderCheck = Promise.resolve(orderCheckEntity);

    await Promise.all([
      this.orderCheckActionRepository.save(newActionEntity),
      this.redisClient.addActionPoint(
        employeeEntity.id,
        orderId,
        saveActionRequest,
      ),
    ]);

    //notification
    let obj = {
      title: 'pet Action',
      body: '',
      notificationTitle: 'pet Action',
      notificationMsg: '',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    // this.SendNotification(obj);

    return new SuccessModel();
  }

  async saveTrackedTime(
    employeeEntity: EmployeeEntity,
    orderId: string,
    saveTrackedTimeRequest: SaveTrackedTimeRequest,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId, employee: employeeEntity.id },
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const orderCheckEntity = await this.orderCheckRepository.findOne({
      where: { id: saveTrackedTimeRequest.orderCheckId, order: orderId },
    });
    if (!orderCheckEntity) {
      throw new NotFoundException('Order check was not found!');
    }

    orderCheckEntity.trackedDuration += saveTrackedTimeRequest.minutes;

    await this.orderCheckRepository.save(orderCheckEntity);

    //notification
    let obj = {
      title: 'Pet Total Time Spend',
      body: '',
      notificationTitle: 'Pet Total Time Spend',
      notificationMsg: '',
      itemId: 'time',
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async attachPhoto(
    employeeEntity: EmployeeEntity,
    orderId: string,
    attachPhotoRequest: AttachPhotoRequest,
    attachment: FileLib,
  ): Promise<AttachPhotoResponse> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId, employee: employeeEntity.id },
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const orderCheckEntity = await this.orderCheckRepository.findOne({
      where: { id: attachPhotoRequest.orderCheckId, order: orderId },
    });
    if (!orderCheckEntity) {
      throw new NotFoundException('Order check was not found!');
    }

    const photoEntity = await this.awsClient.upload(
      attachment,
      FolderEnum.ORDER_ATTACHMENTS,
    );

    await this.photoRepository.save(photoEntity);

    const orderAttachment = new OrderCheckAttachmentEntity();
    orderAttachment.orderCheck = Promise.resolve(orderCheckEntity);
    orderAttachment.photo = Promise.resolve(photoEntity);

    await this.orderCheckAttachmentRepository.save(orderAttachment);

    //notification
    let obj = {
      title: 'See a pet photo',
      body: '',
      notificationTitle: 'See a pet photo',
      notificationMsg: '',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    // this.SendNotification(obj);
    return { url: photoEntity.url };
  }

  async finishOrder(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.findOne({
      where: {
        id: orderId,
        employee: employeeEntity.id,
        status: OrderStatusEnum.IN_PROGRESS,
      },
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    orderEntity.status = OrderStatusEnum.COMPLETED;
    await this.orderRepository.save(orderEntity);

    const employeePayroll: number = +new Decimal(orderEntity.priceWithExtras)
      .mul(employeeEntity.jobRate)
      .div(100)
      .toFixed(2);

    //Add payroll details in Employee
    employeeEntity.payroll = employeeEntity.payroll + employeePayroll;
    employeeEntity.orderAmount =
      employeeEntity.orderAmount + orderEntity.priceWithExtras;
    employeeEntity.totalTime = employeeEntity.totalTime + 1;
    await this.employeeRepository.save(employeeEntity);

    const payrollEntity = new EmployeePayrollEntity();
    payrollEntity.order = Promise.resolve(orderEntity);
    payrollEntity.employee = Promise.resolve(employeeEntity);
    payrollEntity.amount = employeePayroll;
    payrollEntity.empJobRate = employeeEntity.jobRate;

    await this.employeePayrollRepository.save(payrollEntity);

    //notification
    let obj = {
      title: 'Order Complete',
      body: '',
      notificationTitle: 'Order Complete',
      notificationMsg: '',
      itemId: 'finish',
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async getHistoryDetails(
    employeeEntity: EmployeeEntity,
    orderId: string,
  ): Promise<SuccessModel> {
    const orderEntity = await this.orderRepository.getHistoryDetailsAsEmployee(
      employeeEntity.id,
      orderId,
    );
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }
    const email = await this.userRepository.findOne({
      where: {
        id: (await (await (await orderEntity.mainOrder).customer).user).id,
      },
    });

    const response = await makeGetHistoryDetailsResponse(orderEntity);

    await this.emailSenderService.shareWithReport(
      email?.email!,
      response.service.title,
      response.totalDuration,
      response.checklist[0].actions[0].name,
      // response.checklist[1].actions[0].name,
      // response.checklist[2].actions[0].name,
      // response.checklist[3].actions[0].name,
      moment(response.timeFrom).format('hh:mm'),
      moment(response.timeTo).format('hh:mm'),
      moment(response.checklist[0].dateStart).format('hh:mm'),
      // moment(response.checklist[1].dateStart).format('hh:mm'),
      // moment(response.checklist[2].dateStart).format('hh:mm'),
      // moment(response.checklist[3].dateStart).format('hh:mm'),
    );

    return new SuccessModel();
  }
}
