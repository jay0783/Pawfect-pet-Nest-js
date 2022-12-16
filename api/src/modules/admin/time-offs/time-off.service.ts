import { Injectable, NotFoundException } from '@nestjs/common';

import {
  EmployeeTimeOffRepository,
  NotificationFlagRepository,
  NotificationRepository,
} from '@pawfect/db/repositories';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { TimeOffStatusEnum } from '@pawfect/db/entities/enums';
import {
  GetTimeOffDetailsResponse,
  GetTimeOffsResponse,
  makeTimeOffDetailsViewModel,
  makeTimeOffShortViewModelMany,
} from './models';
import { NotificationRequest } from 'src/modules/employee/new-orders/models';
import { EmployeeNotificationEntity } from '@pawfect/db/entities';

let FCM = require('fcm-node');
// let fcm = new FCM(process.env.SERVERKEY);
let fcm = new FCM(
  'AAAA1YrCm5M:APA91bG21e-8cm8f-hWN6zSzv-tzgsYZFVoVaQmdWsBuiVIB157QiOPRJm5OKZ5V0jukwH7lFKmlxg0oUH1de0Q_2QeSTGP14zZBQOcVn-4VcLIKr2AcWAyYumJirLWuyGuN5PEC2i7g',
);
@Injectable()
export class TimeOffService {
  constructor(
    private readonly employeeTimeOffRepository: EmployeeTimeOffRepository,
    private readonly notificationFlagRepository: NotificationFlagRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async SendNotification(notification: NotificationRequest) {
    let userData: any;
    userData = await this.notificationFlagRepository.findOne({
      where: {
        employee: notification.employee,
      },
      relations: ['employee'],
    });

    // console.log('userData', userData);

    if (userData) {
      let count = 0;
      let deviceData: any;
      if (userData['push']) {
        deviceData = {
          token: await (await userData.employee).deviceToken,
          type: await (await userData.employee).deviceType,
        };

        // Store Notification
        const notificationEntity = new EmployeeNotificationEntity();
        notificationEntity.itemId = notification.itemId;
        notificationEntity.isRead = false;
        notificationEntity.title = notification.notificationTitle!;
        notificationEntity.message = notification.notificationMsg!;
        notificationEntity.employee = await (await userData.employee).id;
        await this.notificationRepository.save(notificationEntity);

        //count notification
        count = await this.notificationRepository.count({
          where: {
            employee: await (await userData.employee).id,
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

  async getAllTimeOffs(
    paginationOpt: PaginationRequest,
  ): Promise<GetTimeOffsResponse> {
    const timeOffPagination = await this.employeeTimeOffRepository.getAllTimeOffsAsAdmin(
      TimeOffStatusEnum.WAITING,
      paginationOpt,
    );
    const timeOffViewModels = await makeTimeOffShortViewModelMany(
      timeOffPagination.items,
    );
    const items = await Promise.all(timeOffViewModels);
    return {
      items: items,
      meta: timeOffPagination.meta,
    };
  }

  async getTimeOffDetails(
    timeOffId: string,
  ): Promise<GetTimeOffDetailsResponse> {
    const timeOffEntity = await this.employeeTimeOffRepository.findOne(
      timeOffId,
      {
        relations: ['employee', 'employee.avatar'],
      },
    );

    if (!timeOffEntity) {
      throw new NotFoundException('Time-off not found');
    }

    return makeTimeOffDetailsViewModel(timeOffEntity);
  }

  async acceptTimeOff(timeOffId: string): Promise<SuccessModel> {
    const timeOffEntity = await this.employeeTimeOffRepository.findOne(
      timeOffId,
    );
    if (!timeOffEntity) {
      throw new NotFoundException('Time-off not found');
    }

    timeOffEntity.status = TimeOffStatusEnum.APPROVED;
    await this.employeeTimeOffRepository.save(timeOffEntity);

    let obj = {
      title: 'Time-off',
      body: 'Your Time-off request has been approved',
      notificationTitle: 'Time-off!',
      notificationMsg: 'Time-off',
      itemId: timeOffEntity.id,
      employee: (await timeOffEntity.employee).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async declineTimeOff(timeOffId: string): Promise<SuccessModel> {
    const timeOffEntity = await this.employeeTimeOffRepository.findOne(
      timeOffId,
    );
    if (!timeOffEntity) {
      throw new NotFoundException('Time-off not found');
    }

    timeOffEntity.status = TimeOffStatusEnum.DECLINE;
    await this.employeeTimeOffRepository.save(timeOffEntity);

    let obj = {
      title: 'Time-off',
      body: 'Your Time-off request has been Reject' + timeOffEntity.notes,
      notificationTitle: 'Time-off!',
      notificationMsg: 'Time-off',
      itemId: timeOffEntity.id,
      employee: (await timeOffEntity.employee).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }
}
