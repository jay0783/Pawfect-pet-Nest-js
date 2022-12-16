import { EntityManager } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import { DateTime } from 'luxon';

import {
  EmployeeEntity,
  EmployeeNotificationEntity,
  MainOrderPetEntity,
  MainOrderEntity,
  NotificationEntity,
  OrderCancellationEntity,
  OrderEntity,
  PetEntity,
  ServiceCheckEntity,
  OrderCheckEntity,
  ExtraServiceEntity,
  MainOrderExtraServiceEntity,
} from '@pawfect/db/entities';
import {
  OrderCancellationEnum,
  OrderStatusEnum,
  TimeOffEnum,
  MainOrderStatusEnum,
  FeeEnum,
  TimeOffStatusEnum,
} from '@pawfect/db/entities/enums';

import {
  EmployeeRepository,
  EmployeeTimeOffRepository,
  MainOrderPetRepository,
  NotificationFlagRepository,
  MainOrderRepository,
  NotificationRepository,
  FeeRepository,
  ServiceCheckRepository,
  OrderRepository,
  ServiceRepository,
  OrderCheckRepository,
  HolidayRepository,
  MainOrderVisitRepository,
} from '@pawfect/db/repositories';
import { TransactionManager } from '@pawfect/db/services';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  GetMainOrdersResponse,
  GetMainOrderDetailsResponse,
  MainOrderViewModel,
  makeOrderViewModelMany,
  makePetViewModelMany,
  makeServiceViewModel,
  makeVisitViewModelMany,
  OrderViewModel,
  PetViewModel,
  ServiceViewModel,
  VisitViewModel,
  CancelOrderRequest,
  ChangeDateRequest,
  CustomerViewModel,
  makeCustomerViewModel,
} from './models';
import { NotificationRequest } from 'src/modules/employee/new-orders/models';
import { ServiceEntity } from '../../../shared/db/entities/service/service.entity';
import { DatesManager } from '@pawfect/services';
let FCM = require('fcm-node');
// let fcm = new FCM(process.env.SERVERKEY);
let fcm = new FCM(
  'AAAA1YrCm5M:APA91bG21e-8cm8f-hWN6zSzv-tzgsYZFVoVaQmdWsBuiVIB157QiOPRJm5OKZ5V0jukwH7lFKmlxg0oUH1de0Q_2QeSTGP14zZBQOcVn-4VcLIKr2AcWAyYumJirLWuyGuN5PEC2i7g',
);

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly feeRepository: FeeRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly mainOrderRepository: MainOrderRepository,
    private readonly mainOrderPetRepository: MainOrderPetRepository,
    private readonly appTransactionManager: TransactionManager,
    private readonly notificationFlagRepository: NotificationFlagRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly employeeTimeOffRepository: EmployeeTimeOffRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceCheckRepository: ServiceCheckRepository,
    private readonly orderCheckRepository: OrderCheckRepository,
    private readonly mainOrderVisitRepository: MainOrderVisitRepository,
    private readonly holidayRepository: HolidayRepository,
  ) {}

  async getMainOrders(
    paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const paginationMainOrder = await this.mainOrderRepository.getMainOrdersAsAdmin(
      paginationRequest,
    );
    // console.log('paginationMainOrder: ', paginationMainOrder);
    // console.log('[][------]', customerEntity.id);
    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    const getMainOrderItems: Array<MainOrderViewModel> = [];
    for (const mainOrderEntity of paginationMainOrder.items) {
      const serviceEntity = await mainOrderEntity.service;
      const orderEntities = await mainOrderEntity.orders;
      const mainOrderPetEntities = await mainOrderEntity.mainOrderPets;
      const visitEntities = await mainOrderEntity.visits;
      const customerEntity = await mainOrderEntity.customer;
      const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;
      const holidayDateEntities = await mainOrderEntity.dates;

      const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
        serviceEntity,
      );
      const orderViewModels: Array<OrderViewModel> = await makeOrderViewModelMany(
        orderEntities,
      );
      const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
        mainOrderPetEntities,
      );
      const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
        visitEntities,
      );

      const holidayViewModels = new Array<{ price: number; date: number }>();
      for (const holidayEntity of holidayDateEntities) {
        // console.log('-------', holidayEntity);

        const holidayViewModel = {
          price: holidayFee,
          date: holidayEntity.dateFrom.getTime(),
        };
        if (holidayEntity.isHoliday === true) {
          holidayViewModels.push(holidayViewModel);
        }
      }

      const extraServices = new Array<{ name: string; price: number }>();
      for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
        const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

        const extraViewModel = {
          name: extraServiceEntity.title,
          price: mainOrderExtraServiceEntity.price,
        };
        extraServices.push(extraViewModel);
      }

      //check if any of the new orders's status is confirmed or not
      const checkConfirmOrder = orderViewModels.some((item) => {
        return item['status'] == 'confirmed';
      });
      if (checkConfirmOrder) {
        mainOrderEntity.status = MainOrderStatusEnum.PARTIAL_CONFIRMED; //updates the main-order status, based on the new orders in the main-order
        await this.mainOrderRepository.save(mainOrderEntity);
      }

      //checks if all the new orders's status in the main-order is confirmed
      const confirmedAll = orderViewModels.every((item) => {
        return item['status'] == 'confirmed';
      });
      if (confirmedAll) {
        mainOrderEntity.status = MainOrderStatusEnum.CONFIRMED; //updates the main-order status, based on the new orders in the main-order
        await this.mainOrderRepository.save(mainOrderEntity);
      }

      //checks if all the new orders's status in the main-order is canceled
      const canceledAll = orderViewModels.every((item) => {
        return item['status'] == 'canceled';
      });
      if (canceledAll) {
        mainOrderEntity.status = MainOrderStatusEnum.CANCELED; //updates the main-order status, based on the new orders in the main-order
        await this.mainOrderRepository.save(mainOrderEntity);
      }

      //checks if all the new orders's status in the main-order is canceled
      const completedAll = orderViewModels.every((item) => {
        return item['status'] == 'completed';
      });
      if (completedAll) {
        mainOrderEntity.status = MainOrderStatusEnum.COMPLETED; //updates the main-order status, based on the new orders in the main-order
        await this.mainOrderRepository.save(mainOrderEntity);
      }

      //Orders Listing in ASC
      let orderViewModel = orderViewModels.sort(function (a, b) {
        return a.timeFrom - b.timeFrom;
      });

      const [customerViewModel] = await Promise.all([
        makeCustomerViewModel(customerEntity),
      ]);

      const mainOrderViewModel = {
        id: mainOrderEntity.id,
        firstDate: mainOrderEntity.firstDate.getTime(),
        lastDate: mainOrderEntity.lastDate.getTime(),
        service: serviceViewModel,
        status: mainOrderEntity.status,
        pets: petViewModels,
        visits: visitViewModels,
        orders: orderViewModel,
        customer: customerViewModel,
        createdAt: mainOrderEntity.createdAt.getTime(),
        total: {
          totalAmount: mainOrderEntity.totalAmount,
          holidays: holidayViewModels,
          extras: extraServices,
        },
      };

      getMainOrderItems.push(mainOrderViewModel);
    }

    return {
      items: getMainOrderItems,
      meta: paginationMainOrder.meta,
    };
  }

  async getCofirmedMainOrders(
    paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const paginationMainOrder = await this.mainOrderRepository.getConfirmedMainOrdersAsAdmin(
      paginationRequest,
    );
    // console.log('paginationMainOrder: ', paginationMainOrder);
    // console.log('[][------]', customerEntity.id);
    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    const getMainOrderItems: Array<MainOrderViewModel> = [];
    for (const mainOrderEntity of paginationMainOrder.items) {
      const serviceEntity = await mainOrderEntity.service;
      const orderEntities = await mainOrderEntity.orders;
      const mainOrderPetEntities = await mainOrderEntity.mainOrderPets;
      const visitEntities = await mainOrderEntity.visits;
      const customerEntity = await mainOrderEntity.customer;
      const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;
      const holidayDateEntities = await mainOrderEntity.dates;

      const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
        serviceEntity,
      );
      const orderViewModels: Array<OrderViewModel> = await makeOrderViewModelMany(
        orderEntities,
      );
      const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
        mainOrderPetEntities,
      );
      const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
        visitEntities,
      );

      const holidayViewModels = new Array<{ price: number; date: number }>();
      for (const holidayEntity of holidayDateEntities) {
        // console.log('-------', holidayEntity);

        const holidayViewModel = {
          price: holidayFee,
          date: holidayEntity.dateFrom.getTime(),
        };
        if (holidayEntity.isHoliday === true) {
          holidayViewModels.push(holidayViewModel);
        }
      }

      const extraServices = new Array<{ name: string; price: number }>();
      for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
        const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

        const extraViewModel = {
          name: extraServiceEntity.title,
          price: mainOrderExtraServiceEntity.price,
        };
        extraServices.push(extraViewModel);
      }

      // //check if any of the new orders's status is confirmed or not
      // const checkConfirmOrder = orderViewModels.some((item) => {
      //   return item['status'] == 'confirmed';
      // });
      // if (checkConfirmOrder) {
      //   mainOrderEntity.status = MainOrderStatusEnum.PARTIAL_CONFIRMED; //updates the main-order status, based on the new orders in the main-order
      //   await this.mainOrderRepository.save(mainOrderEntity);
      // }

      // //checks if all the new orders's status in the main-order is confirmed
      // const confirmedAll = orderViewModels.every((item) => {
      //   return item['status'] == 'confirmed';
      // });
      // if (confirmedAll) {
      //   mainOrderEntity.status = MainOrderStatusEnum.CONFIRMED; //updates the main-order status, based on the new orders in the main-order
      //   await this.mainOrderRepository.save(mainOrderEntity);
      // }

      // //checks if all the new orders's status in the main-order is canceled
      // const canceledAll = orderViewModels.every((item) => {
      //   return item['status'] == 'canceled';
      // });
      // if (canceledAll) {
      //   mainOrderEntity.status = MainOrderStatusEnum.CANCELED; //updates the main-order status, based on the new orders in the main-order
      //   await this.mainOrderRepository.save(mainOrderEntity);
      // }

      // //checks if all the new orders's status in the main-order is canceled
      // const completedAll = orderViewModels.every((item) => {
      //   return item['status'] == 'completed';
      // });
      // if (completedAll) {
      //   mainOrderEntity.status = MainOrderStatusEnum.COMPLETED; //updates the main-order status, based on the new orders in the main-order
      //   await this.mainOrderRepository.save(mainOrderEntity);
      // }

      //Orders Listing in ASC
      let orderViewModel = orderViewModels.sort(function (a, b) {
        return a.timeFrom - b.timeFrom;
      });

      const [customerViewModel] = await Promise.all([
        makeCustomerViewModel(customerEntity),
      ]);

      const mainOrderViewModel = {
        id: mainOrderEntity.id,
        firstDate: mainOrderEntity.firstDate.getTime(),
        lastDate: mainOrderEntity.lastDate.getTime(),
        service: serviceViewModel,
        status: mainOrderEntity.status,
        pets: petViewModels,
        visits: visitViewModels,
        orders: orderViewModel,
        customer: customerViewModel,
        createdAt: mainOrderEntity.createdAt.getTime(),
        total: {
          totalAmount: mainOrderEntity.totalAmount,
          holidays: holidayViewModels,
          extras: extraServices,
        },
      };

      getMainOrderItems.push(mainOrderViewModel);
    }

    return {
      items: getMainOrderItems,
      meta: paginationMainOrder.meta,
    };
  }

  async getMainOrderDetails(
    mainOrderId: string,
  ): Promise<GetMainOrderDetailsResponse> {
    const mainOrderEntity:
      | MainOrderEntity
      | undefined = await this.mainOrderRepository.getMainOrderDetailsAsAdmin(
      mainOrderId,
    );

    if (!mainOrderEntity) {
      throw new NotFoundException('Main order was not found!');
    }

    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    const serviceEntity = await mainOrderEntity.service;
    const orderEntities = await mainOrderEntity.orders;
    const mainOrderPetEntities = await mainOrderEntity.mainOrderPets;
    const visitEntities = await mainOrderEntity.visits;
    const mainOrderExtraServiceEntities = await mainOrderEntity.mainOrderExtras;
    const holidayDateEntities = await mainOrderEntity.dates;

    const holidayViewModels = new Array<{ price: number; date: number }>();
    for (const holidayEntity of holidayDateEntities) {
      const holidayViewModel = {
        price: holidayFee,
        date: holidayEntity.dateFrom.getTime(),
      };
      holidayViewModels.push(holidayViewModel);
    }

    const extraServices = new Array<{ name: string; price: number }>();
    for (const mainOrderExtraServiceEntity of mainOrderExtraServiceEntities) {
      const extraServiceEntity = await mainOrderExtraServiceEntity.extraService;

      const extraViewModel = {
        name: extraServiceEntity.title,
        price: mainOrderExtraServiceEntity.price,
      };
      extraServices.push(extraViewModel);
    }

    const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
      serviceEntity,
    );
    const orderViewModels: Array<OrderViewModel> = await makeOrderViewModelMany(
      orderEntities,
    );
    const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
      mainOrderPetEntities,
    );
    const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
      visitEntities,
    );

    // Orders Listing in ASC
    let orderViewModel = orderViewModels.sort(function (a, b) {
      return a.timeFrom - b.timeFrom;
    });

    const mainOrderViewModel: GetMainOrderDetailsResponse = {
      id: mainOrderEntity.id,
      firstDate: mainOrderEntity.firstDate.getTime(),
      lastDate: mainOrderEntity.lastDate.getTime(),
      comment: mainOrderEntity.comment,
      service: serviceViewModel,
      status: mainOrderEntity.status,
      pets: petViewModels,
      visits: visitViewModels,
      orders: orderViewModel,
      createdAt: mainOrderEntity.createdAt.getTime(),
      total: {
        totalAmount: mainOrderEntity.totalAmount,
        holidays: holidayViewModels,
        extras: extraServices,
      },
    };

    return mainOrderViewModel;
  }

  async SendNotification(notification: NotificationRequest) {
    let userData: any;
    if (notification.customer) {
      userData = await this.notificationFlagRepository.findOne({
        where: {
          customer: notification.customer,
        },
        relations: ['customer'],
      });
    } else if (notification.employee) {
      userData = await this.notificationFlagRepository.findOne({
        where: {
          employee: notification.employee,
        },
        relations: ['employee'],
      });
    }

    // console.log('userData', userData);

    if (userData) {
      let count = 0;
      let deviceData: any;
      if (userData['push']) {
        if (await await userData.customer) {
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
        } else if (await await userData.employee) {
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

  async setEmployeeOrder(
    orderId: string,
    employeeId: string,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne(orderId, {
      relations: ['employee'],
    });
    if (
      !orderEntity ||
      (orderEntity.status !== OrderStatusEnum.CONFIRMED &&
        orderEntity.status !== OrderStatusEnum.PENDING)
    ) {
      throw new NotFoundException('Order was not found!');
    }
    // console.log('orderEntity: ', orderEntity);

    const employeeEntity:
      | EmployeeEntity
      | undefined = await this.employeeRepository.findOne(employeeId);
    if (!employeeEntity) {
      throw new NotFoundException('Employee was not found!');
    }

    //For employee availability
    const employeeAvailable = await this.employeeTimeOffRepository.find({
      where: {
        employee: employeeId,
        status: TimeOffStatusEnum.APPROVED,
      },
    });

    for (let i = 0; i < employeeAvailable.length; i++) {
      const isAvailable = employeeAvailable[i].dates.findIndex((date) => {
        return (
          date.toLocaleDateString() ===
            orderEntity.dateFrom.toLocaleDateString() ||
          date.toLocaleDateString() === orderEntity.dateTo.toLocaleDateString()
        );
      });

      if (isAvailable !== -1) {
        if (employeeAvailable[i].type === TimeOffEnum.SICK) {
          throw new NotFoundException('Employee is on Sick leave!');
        } else if (employeeAvailable[i].type === TimeOffEnum.BUSINESS_TRIP) {
          throw new NotFoundException('Employee is on Vacation!');
        } else {
          throw new NotFoundException('Employee is on leave!');
        }
      }
    }
    // console.log('Not on leave');
    //employee time
    const findEmployee = await this.orderRepository.find({
      where: {
        employee: employeeId,
      },
    });

    for (let i = 0; i < findEmployee.length; i++) {
      if (
        orderEntity.dateFrom >= findEmployee[i].dateFrom &&
        orderEntity.dateTo <= findEmployee[i].dateTo &&
        orderEntity.isEmployeeAccepted === true
      ) {
        throw new NotFoundException(
          'Employee unavailable for selected date/time slot!',
        );
      }
    }

    const mainOrderEntity = await orderEntity.mainOrder;
    const mainOrderPetsEntities: Array<MainOrderPetEntity> = await this.mainOrderPetRepository.getByMainOrderId(
      mainOrderEntity,
    );

    const petsEntities: Array<PetEntity> = new Array();
    const petIds: Array<string> = new Array();
    for (const mainOrderPet of mainOrderPetsEntities) {
      const petEntity = await mainOrderPet.pet;
      petsEntities.push(petEntity);
      petIds.push(petEntity.id);
    }

    const isFirstMeet: boolean = await this.mainOrderPetRepository.isFirstMeet(
      employeeEntity.id,
      petIds,
    );

    orderEntity.employee = Promise.resolve(employeeEntity);
    orderEntity.isEmployeeAccepted = false;
    orderEntity.status = OrderStatusEnum.PENDING;
    orderEntity.isFirstMeeting = isFirstMeet;
    await this.orderRepository.save(orderEntity);

    //updating main order status, to make it appear in the new orders list
    if (mainOrderEntity.status === MainOrderStatusEnum.CONFIRMED) {
      mainOrderEntity.status = MainOrderStatusEnum.PARTIAL_CONFIRMED;
      await this.mainOrderRepository.save(mainOrderEntity);
    }

    let obj = {
      title: 'New Order Arrived',
      body: 'Please check your new order details',
      notificationTitle: 'New Order Arrived!',
      notificationMsg: 'New Order Arrived',
      itemId: orderId,
      employee: employeeEntity.id,
    };

    this.SendNotification(obj);
    // }

    return new SuccessModel();
  }

  async setEmployeeToMainOrder(
    orderId: string,
    employeeId: string,
  ): Promise<Boolean> {
    console.log('orderId======>', orderId);
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatusEnum.PENDING },
    });
    if (!orderEntity) {
      // throw new NotFoundException('Order was not found!');
      return false;
    }

    const employeeEntity:
      | EmployeeEntity
      | undefined = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new NotFoundException('Employee was not found!');
    }

    //For employee availbality
    const employeeAvailable = await this.employeeTimeOffRepository.find({
      where: {
        employee: employeeId,
        status: TimeOffStatusEnum.APPROVED,
      },
    });

    for (let i = 0; i < employeeAvailable.length; i++) {
      const isAvailable = employeeAvailable[i].dates.findIndex((date) => {
        return (
          date.toLocaleDateString() ===
            orderEntity.dateFrom.toLocaleDateString() ||
          date.toLocaleDateString() === orderEntity.dateTo.toLocaleDateString()
        );
      });

      if (isAvailable !== -1) {
        if (employeeAvailable[i].type === TimeOffEnum.SICK) {
          // throw new NotFoundException('Employee On Sick Leave!');
          return false;
        } else if (employeeAvailable[i].type === TimeOffEnum.BUSINESS_TRIP) {
          // throw new NotFoundException('Employee On Leave!');
          return false;
        } else {
          // throw new NotFoundException('Employee unavailable!');
          return false;
        }
      }
    }
    console.log('Not on leave');
    //employee time
    const findEmployee = await this.orderRepository.find({
      where: {
        employee: employeeId,
      },
    });

    for (let i = 0; i < findEmployee.length; i++) {
      if (
        orderEntity.dateFrom >= findEmployee[i].dateFrom &&
        orderEntity.dateTo <= findEmployee[i].dateTo &&
        orderEntity.isEmployeeAccepted === true
      ) {
        // throw new NotFoundException('Employee unavailable!');
        return false;
      }
    }

    const mainOrderEntity = await orderEntity.mainOrder;
    const mainOrderPetsEntities: Array<MainOrderPetEntity> = await this.mainOrderPetRepository.getByMainOrderId(
      mainOrderEntity,
    );

    const petsEntities: Array<PetEntity> = new Array();
    const petIds: Array<string> = new Array();
    for (const mainOrderPet of mainOrderPetsEntities) {
      const petEntity = await mainOrderPet.pet;
      petsEntities.push(petEntity);
      petIds.push(petEntity.id);
    }

    const isFirstMeet: boolean = await this.mainOrderPetRepository.isFirstMeet(
      employeeEntity.id,
      petIds,
    );

    orderEntity.employee = Promise.resolve(employeeEntity);
    orderEntity.isEmployeeAccepted = false;
    orderEntity.isFirstMeeting = isFirstMeet;

    await this.orderRepository.save(orderEntity);

    let obj = {
      title: 'New Order Arrived',
      body: 'please check your new order details',
      notificationTitle: 'New Order Arrived!',
      notificationMsg: 'New Order Arrived',
      itemId: orderId,
      employee: employeeEntity.id,
    };

    this.SendNotification(obj);
    // }

    return true;
  }

  async changeDate(
    orderId: string,
    changeDateRequest: ChangeDateRequest,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['service'],
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const serviceEntity = await orderEntity.service;

    const timeDateTime: DateTime = DateTime.fromMillis(changeDateRequest.time);
    const dateFrom = DateTime.fromMillis(changeDateRequest.date).set({
      hour: timeDateTime.hour,
      minute: timeDateTime.minute,
      second: 0,
      millisecond: 0,
    });
    const dateTo = dateFrom.plus({ minute: serviceEntity.sumDuration });

    orderEntity.dateFrom = dateFrom.toJSDate();
    orderEntity.dateTo = dateTo.toJSDate();
    // orderEntity.employee = Promise.resolve(null);
    // orderEntity.isEmployeeAccepted = false;
    await this.orderRepository.save(orderEntity);

    //updating the main-order first date and last date based on the updated order dates
    const mainOrderEntity: MainOrderEntity = await orderEntity.mainOrder;
    const allOrdersEntities: Array<OrderEntity> = await mainOrderEntity.orders;
    const orderDates: Array<number> = allOrdersEntities.map((order) => {
      return order.dateFrom.getTime();
    });

    const orderDatesManager = new DatesManager(orderDates)
      .setDateTimesToZero()
      .removeDuplicates();

    const startedDate: DateTime = orderDatesManager.minDate();
    const endedDate: DateTime = orderDatesManager.maxDate();

    mainOrderEntity.firstDate = startedDate.toJSDate();
    mainOrderEntity.lastDate = endedDate.toJSDate();
    await this.mainOrderRepository.save(mainOrderEntity);

    let obj = {
      title: 'Date and Time',
      body:
        'please check your order Date – ' +
        orderEntity.dateFrom +
        'to' +
        orderEntity.dateTo,
      notificationTitle: 'Your order date and time has been changed!',
      notificationMsg: 'Your order date and time has been changed',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async cancelOrder(
    orderId: string,
    commentRequest: CancelOrderRequest,
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

    const orderCancellationEntity = new OrderCancellationEntity();
    orderCancellationEntity.order = Promise.resolve(orderEntity);
    orderCancellationEntity.reason = commentRequest.comment;
    orderCancellationEntity.type = OrderCancellationEnum.ADMIN;

    const mainOrderEntity = await orderEntity.mainOrder;
    const customerEntity = await mainOrderEntity.customer;

    mainOrderEntity.totalAmount = +new Decimal(mainOrderEntity.totalAmount)
      .minus(orderEntity.priceWithExtras)
      .toFixed(2);

    customerEntity.balance = +new Decimal(customerEntity.balance)
      .plus(orderEntity.priceWithExtras)
      .toFixed(2);

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
    //notification
    let obj = {
      title: 'Order Details',
      body: 'Your order has been CANCELED' + orderCancellationEntity.reason,
      notificationTitle: 'CANCELED',
      notificationMsg: 'Your order has been CANCELED',
      itemId: orderId,
      customer: (await (await orderEntity.mainOrder).customer).id,
    };
    this.SendNotification(obj);
    return new SuccessModel();
  }

  async changeService(
    mainOrderId: string,
    serviceId: string,
  ): Promise<SuccessModel> {
    console.log('API_hit');
    const mainOrderEntity:
      | MainOrderEntity
      | undefined = await this.mainOrderRepository.findOne(mainOrderId);
    const orders:
      | Array<OrderEntity>
      | undefined = await mainOrderEntity?.orders;
    const mainOrdervisitEntities = await mainOrderEntity!.visits;
    const mainOrderDays = await mainOrderEntity!.dates;

    const existingService:
      | ServiceEntity
      | undefined = await mainOrderEntity?.service;
    const mainOrderExtrasEntity:
      | Array<MainOrderExtraServiceEntity>
      | undefined = await mainOrderEntity?.mainOrderExtras;

    const existingChecklist:
      | Array<ServiceCheckEntity>
      | undefined = await existingService?.checklist;
    const serviceEntity:
      | ServiceEntity
      | undefined = await this.serviceRepository.findOne(serviceId);
    const serviceChecks:
      | Array<ServiceCheckEntity>
      | undefined = await serviceEntity?.checklist;

    if (existingService?.id == serviceEntity?.id) {
      throw new BadRequestException(
        'Selected service is same as the original service ',
      );
    }
    // const startedDate: DateTime = DateTime.fromMillis(
    //   mainOrderEntity!.firstDate.getTime(),
    // );
    // const endedDate: DateTime = DateTime.fromMillis(
    //   mainOrderEntity!.lastDate.getTime(),
    // );
    const totalExtrasAmount = mainOrderExtrasEntity!.reduce(
      (accum, item) => accum + item.price,
      0,
    );
    // console.log('totalExtrasAmount: ', totalExtrasAmount);
    let timeTo: Date;
    const mainOrderDaysHolidays = mainOrderDays.filter((orderDay) => {
      return orderDay.isHoliday == true;
    });
    // console.log('mainOrderDaysHolidays: ', mainOrderDaysHolidays);

    const priceWithExtrasPerOrder: Decimal = new Decimal(
      serviceEntity!.price,
    ).plus(totalExtrasAmount);

    if (existingChecklist && existingChecklist.length) {
      //deleting all the checks for the order
      for (let i = 0; i < existingChecklist!.length; i++) {
        await this.serviceCheckRepository.remove(existingChecklist[i]);
      }
    }

    for (const orderEntity of orders!) {
      for (const serviceCheck of serviceChecks!) {
        //adding checklist as per the new service
        const orderCheckEntity = new OrderCheckEntity();
        orderCheckEntity.numOrder = serviceCheck.numOrder;
        orderCheckEntity.name = serviceCheck.name;
        orderCheckEntity.duration = serviceCheck.duration;
        orderCheckEntity.order = Promise.resolve(orderEntity);
        await this.orderCheckRepository.save(orderCheckEntity);
      }
      //updating the orders with new service
      orderEntity.service = Promise.resolve(serviceEntity!);
      orderEntity.dateTo = DateTime.fromJSDate(orderEntity.dateFrom)
        .plus({ minute: serviceEntity!.sumDuration })
        .toJSDate();
      timeTo = orderEntity.dateTo;
      orderEntity.priceWithExtras = +priceWithExtrasPerOrder;
      await this.orderRepository.save(orderEntity);
    }

    //updating the visit time according to service duration
    // console.log('hello');
    for (let i = 0; i < mainOrdervisitEntities.length; i++) {
      mainOrdervisitEntities[i].timeTo = DateTime.fromJSDate(
        mainOrdervisitEntities[i].timeFrom,
      )
        .plus({ minute: serviceEntity!.sumDuration })
        .toJSDate();
      await this.mainOrderVisitRepository.save(mainOrdervisitEntities[i]);
    }

    //calculating the holiday comission amount for each order
    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    const holidayAmount: Decimal = new Decimal(priceWithExtrasPerOrder)
      .mul(holidayFee)
      .div(100);

    let totalAmountSafe: Decimal = new Decimal(priceWithExtrasPerOrder);
    if (mainOrderDaysHolidays && mainOrderDaysHolidays.length) {
      totalAmountSafe = priceWithExtrasPerOrder.plus(holidayAmount);
    }
    mainOrderEntity!.totalAmount = +totalAmountSafe.toFixed(2);
    mainOrderEntity!.service = Promise.resolve(serviceEntity!);
    await this.mainOrderRepository.save(mainOrderEntity!);

    return new SuccessModel();
  }

  async findMainOrder(mainOrderId: string): Promise<MainOrderEntity> {
    const mainOrderEntity = await this.mainOrderRepository.findOne(
      mainOrderId,
      { loadRelationIds: { relations: ['orders'] } },
    );
    if (!mainOrderEntity) {
      throw new NotFoundException('Main order not found !');
    }
    // console.log('mainOrderEntity: ==========>>>>', mainOrderEntity.orders);

    // const orders = mainOrderEntity;
    return mainOrderEntity!;
  }

  async applyDiscountOnOrder(
    orderId: string,
    discount: number,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne(orderId);
    if (!orderEntity) {
      throw new NotFoundException('Order not found !');
    }
    const orderAmount: number = orderEntity.priceWithExtras;
    if (discount > orderAmount) {
      throw new BadRequestException('Discount cannot exceed order amount');
    }

    orderEntity.discount = discount;
    await this.orderRepository.save(orderEntity);
    return new SuccessModel();
  }
}
