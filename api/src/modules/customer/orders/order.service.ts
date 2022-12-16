import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DateTime, Settings } from 'luxon';
import { In } from 'typeorm';
import { Decimal } from 'decimal.js';
import { EntityManager } from 'typeorm';

import {
  CustomerRepository,
  ExtraServiceRepository,
  FeeRepository,
  HolidayRepository,
  MainOrderRepository,
  OrderRepository,
  PetRepository,
  ServiceRepository,
  TransactionsRepository,
  CardRepository,
  FirstOrderRepository,
} from '@pawfect/db/repositories';
import {
  CustomerEntity,
  ExtraServiceEntity,
  MainOrderEntity,
  MainOrderVisitEntity,
  OrderEntity,
  OrderCancellationEntity,
  FreeOrderEntity,
} from '@pawfect/db/entities';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  FeeEnum,
  MainOrderStatusEnum,
  MainOrderVisitEnum,
  CustomerTransactionEnum,
  OrderStatusEnum,
  OrderCancellationEnum,
} from '@pawfect/db/entities/enums';
import {
  CancelMainOrderRequest,
  CreateMainOrderRequest,
  GetMainOrderDetailsResponse,
  GetMainOrdersResponse,
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
  CreateFirstOrderRequest,
  ExtraOrderViewModel,
  ExtrasServiceViewModel,
  makeExtraServiceViewModel,
  StatusResponse,
  makeCustomerViewModel,
} from './models';
import { DatesManager } from '@pawfect/services';
import { TransactionManager } from '@pawfect/db/services';
import { SocketGateway } from 'src/modules/socket/socket.gateway';

@Injectable()
export class OrderService {
  constructor(
    private readonly holidayRepository: HolidayRepository,
    private readonly mainOrderRepository: MainOrderRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly petRepository: PetRepository,
    private readonly feeRepository: FeeRepository,
    private readonly extraServiceRepository: ExtraServiceRepository,
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly transactionRepository: TransactionsRepository,
    private readonly cardRepository: CardRepository,
    private readonly appTransactionManager: TransactionManager,
    private readonly firstOrderRepository: FirstOrderRepository,
  ) {}

  async getMainOrders(
    customerEntity: CustomerEntity,
    paginationRequest: PaginationRequest,
  ): Promise<GetMainOrdersResponse> {
    const paginationMainOrder = await this.mainOrderRepository.getMainOrdersAsCustomer(
      customerEntity.id,
      paginationRequest,
    );
    // console.log('[][------]', customerEntity.id);

    const getMainOrderItems: Array<MainOrderViewModel> = [];
    for (const mainOrderEntity of paginationMainOrder.items) {
      const serviceEntity = await mainOrderEntity.service;
      const orderEntities = await mainOrderEntity.orders;
      const mainOrderPetEntities = await mainOrderEntity.mainOrderPets;
      const visitEntities = await mainOrderEntity.visits;

      const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
        serviceEntity,
      );
      const orderViewModels: Array<OrderViewModel> = makeOrderViewModelMany(
        orderEntities,
      );
      const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
        mainOrderPetEntities,
      );
      const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
        visitEntities,
      );

      for (let i = 0; i < orderViewModels.length; i++) {
        if (orderViewModels[i]['status'] == 'confirmed') {
          mainOrderEntity.status = MainOrderStatusEnum.PARTIAL_CONFIRMED;
          await this.mainOrderRepository.save(mainOrderEntity);
          break;
        }
        // if (i == orderViewModels.length) {
        //   mainOrderEntity.status = MainOrderStatusEnum.PARTIAL_CONFIRMED;
        //   await this.mainOrderRepository.save(mainOrderEntity);
        // }
      }

      for (let i = 0; i < orderViewModels.length; i++) {
        if (orderViewModels[i]['status'] != 'confirmed') {
          break;
        }
        if (i + 1 == orderViewModels.length) {
          mainOrderEntity.status = MainOrderStatusEnum.CONFIRMED;
          await this.mainOrderRepository.save(mainOrderEntity);
        }
      }

      for (let i = 0; i < orderViewModels.length; i++) {
        if (orderViewModels[i]['status'] != 'canceled') {
          break;
        }
        if (i + 1 == orderViewModels.length) {
          mainOrderEntity.status = MainOrderStatusEnum.CANCELED;
          await this.mainOrderRepository.save(mainOrderEntity);
        }
      }

      for (let i = 0; i < orderViewModels.length; i++) {
        if (orderViewModels[i]['status'] != 'completed') {
          break;
        }
        if (i + 1 == orderViewModels.length) {
          mainOrderEntity.status = MainOrderStatusEnum.COMPLETED;
          await this.mainOrderRepository.save(mainOrderEntity);
        }
      }

      //Orders Listing in ASC
      let orderViewModel = orderViewModels.sort(function (a, b) {
        return a.dateFrom - b.dateFrom;
      });

      const [customerViewModel] = await Promise.all([
        makeCustomerViewModel(customerEntity),
      ]);

      const mainOrderViewModel: MainOrderViewModel = {
        id: mainOrderEntity.id,
        firstDate: mainOrderEntity.firstDate.getTime(),
        lastDate: mainOrderEntity.lastDate.getTime(),
        service: serviceViewModel,
        status: mainOrderEntity.status,
        pets: petViewModels,
        visits: visitViewModels,
        orders: orderViewModel,
        customer: customerViewModel,
      };

      getMainOrderItems.push(mainOrderViewModel);
    }

    return {
      items: getMainOrderItems,
      meta: paginationMainOrder.meta,
    };
  }

  async getMainOrderDetails(
    customerEntity: CustomerEntity,
    mainOrderId: string,
  ): Promise<GetMainOrderDetailsResponse> {
    const mainOrderEntity:
      | MainOrderEntity
      | undefined = await this.mainOrderRepository.getMainOrderDetailsAsCustomer(
      customerEntity.id,
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
    const orderViewModels: Array<OrderViewModel> = makeOrderViewModelMany(
      orderEntities,
    );
    const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
      mainOrderPetEntities,
    );
    const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
      visitEntities,
    );

    //Orders Listing in ASC
    let orderViewModel = orderViewModels.sort(function (a, b) {
      return a.dateFrom - b.dateFrom;
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

  async createMainOrder(
    customerEntity: CustomerEntity,
    createMainOrderRequest: CreateMainOrderRequest,
  ): Promise<MainOrderViewModel> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id: createMainOrderRequest.serviceId },
      relations: ['logo'],
    });
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }

    const petEntities = await this.petRepository.find({
      where: { id: In(createMainOrderRequest.petIds) },
    });
    if (
      !petEntities ||
      !petEntities.length ||
      petEntities.length !== createMainOrderRequest.petIds.length
    ) {
      throw new NotFoundException('Pets was not found!');
    }

    let totalExtrasAmount = 0;
    let extraEntities: Array<ExtraServiceEntity> = [];
    if (
      createMainOrderRequest.extraIds &&
      createMainOrderRequest.extraIds.length
    ) {
      const {
        extrasEntities,
        totalAmount,
      } = await this.extraServiceRepository.findByIdsAndCalculate(
        createMainOrderRequest.extraIds,
      );

      if (
        !extrasEntities ||
        !extrasEntities.length ||
        extrasEntities.length !== createMainOrderRequest.extraIds.length
      ) {
        throw new NotFoundException('Extras was not found!');
      }

      extraEntities = extrasEntities;
      totalExtrasAmount = totalAmount;
    }

    const orderDatesManager = new DatesManager(createMainOrderRequest.dates)
      .setDateTimesToZero()
      .removeDuplicates();

    const startedDate = orderDatesManager.minDate();
    const endedDate = orderDatesManager.maxDate();

    // const started = Math.min(...createMainOrderRequest.dates);
    // const ended = Math.min(...createMainOrderRequest.dates);
    // const startedDate = DateTime.fromMillis(started);
    // const endedDate = DateTime.fromMillis(ended);

    // console.log('initial_date===:>', createMainOrderRequest.dates[0]);
    // console.log('startedDate_date===:>', startedDate);

    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    // console.log('holiday_fee===>', holidayFee);
    const holidaysSet: Set<number> = await this.holidayRepository.getSetByDateRange(
      {
        dateFrom: startedDate,
        dateTo: endedDate,
      },
    );

    //Order Amount from the App side
    const priceWithExtrasPerOrder: Decimal = new Decimal(
      createMainOrderRequest.amount,
    ).plus(totalExtrasAmount);

    const { dates: orderDates } = createMainOrderRequest.getOrderDates(
      serviceEntity,
      priceWithExtrasPerOrder,
      holidayFee,
      holidaysSet,
    );
    console.log('order_dates===>>>>', orderDates);

    // console.log('Orders_dates==>', orderDates);

    // const totalAmountSafe: number = +priceWithExtrasPerOrder
    //   .mul(createMainOrderRequest.dates.length)
    //   // .mul(createMainOrderRequest.dates.length)
    //   .toFixed(2);

    // const total = orderDates.reduce((prevDate, currdate) => {
    //   return prevDate.amount + currdate.amount;
    // }, 0);

    const total_amount_main_order = orderDates.reduce(
      (accum, item) => accum + item.amount,
      0,
    );
    const totalAmountSafe: number = +new Decimal(
      total_amount_main_order,
    ).toFixed(2);

    console.log('totalAmountSafe: ', totalAmountSafe);
    if (customerEntity.balance < totalAmountSafe) {
      throw new BadRequestException(
        'Customer balance less then need for order!',
      );
    }

    const newMainOrder = await this.mainOrderRepository.saveMainOrder(
      {
        startedDate: startedDate,
        endedDate: endedDate,
        comment: createMainOrderRequest.comment,
        totalAmountSafe,
      },
      {
        customer: customerEntity,
        service: serviceEntity,
      },
    );
    // console.log('NewOrder------>', newMainOrder);

    //Save details in Transaction
    // const petEntity = await this.petRepository.findOne({
    //   where: { id: createMainOrderRequest.petIds },
    //   relations: ['logo'],
    // });
    // const pets = createMainOrderRequest.petIds.toString();
    // const transactionRepository = await this.transactionRepository.saveMainTransaction(
    //   {
    //     amount: totalAmountSafe,
    //     type: CustomerTransactionEnum.SPENT,
    //     pet: pets,
    //   },
    //   {
    //     // pet: petEntity,
    //     customer: customerEntity,
    //   },
    // );
    // console.log('[][=================]', transactionRepository);

    let orderEntities: Array<OrderEntity> = new Array<OrderEntity>();
    let mainOrderVisitEntities: Array<MainOrderVisitEntity> = new Array<MainOrderVisitEntity>();
    let mainOrderVisits = new Array<{
      timeFrom: DateTime;
      timeTo: DateTime;
      type: MainOrderVisitEnum;
    }>();
    try {
      await this.mainOrderRepository.setDays(newMainOrder, orderDates);
      await this.mainOrderRepository.setPets(newMainOrder, petEntities);

      mainOrderVisits = createMainOrderRequest.getMainOrderVisits(
        serviceEntity,
      );
      mainOrderVisitEntities = await this.mainOrderRepository.setVisits(
        newMainOrder,
        mainOrderVisits,
      );

      await this.mainOrderRepository.setExtras(newMainOrder, extraEntities);

      const serviceChecks = await this.serviceRepository.getServiceChecks(
        serviceEntity,
      );

      orderEntities = await this.orderRepository.createBulkWithChecks(
        {
          dates: orderDates,
          serviceChecks,
          priceWithExtras: +priceWithExtrasPerOrder.toFixed(2),
          holidayFee,
          comment: createMainOrderRequest.comment,
        },
        {
          service: serviceEntity,
          mainOrder: newMainOrder,
          // customer: customerEntity,
        },
        orderDates,
      );
      console.log('-----Check Here-->', orderEntities);
    } catch (err) {
      await this.mainOrderRepository.remove(newMainOrder);
      throw err;
    }

    customerEntity.balance = +new Decimal(customerEntity.balance)
      .minus(totalAmountSafe)
      .toFixed(2);
    await this.customerRepository.save(customerEntity);

    const serviceViewModel: ServiceViewModel = await makeServiceViewModel(
      serviceEntity,
    );
    const orderViewModels: Array<OrderViewModel> = makeOrderViewModelMany(
      orderEntities,
    );
    const petViewModels: Array<PetViewModel> = await makePetViewModelMany(
      petEntities,
    );
    const visitViewModels: Array<VisitViewModel> = makeVisitViewModelMany(
      mainOrderVisitEntities,
    );

    const [customerViewModel] = await Promise.all([
      makeCustomerViewModel(customerEntity),
    ]);

    console.log('server_timeZone===>', DateTime.local().zoneName);
    // Settings.defaultZone = 'system';
    return {
      id: newMainOrder.id,
      firstDate: newMainOrder.firstDate.getTime(),
      lastDate: newMainOrder.lastDate.getTime(),
      service: serviceViewModel,
      status: MainOrderStatusEnum.PENDING,
      pets: petViewModels,
      visits: visitViewModels,
      orders: orderViewModels,
      customer: customerViewModel,
    };
  }

  async cancelMainOrder(
    customerEntity: CustomerEntity,
    cancelRequest: CancelMainOrderRequest,
  ): Promise<SuccessModel> {
    const mainOrderEntity:
      | MainOrderEntity
      | undefined = await this.mainOrderRepository.getMainOrderForCancel(
      cancelRequest.id,
      customerEntity.id,
    );

    if (!mainOrderEntity) {
      throw new NotFoundException('MainOrder was not found!');
    }

    const createdAtAfter2Day: DateTime = DateTime.fromJSDate(
      mainOrderEntity.createdAt,
    ).plus({ day: 2 });

    if (+createdAtAfter2Day > +DateTime.utc()) {
      customerEntity.balance += mainOrderEntity.totalAmount;

      await this.customerRepository.save(customerEntity);
      // await this.mainOrderRepository.remove(mainOrderEntity);

      //main Order Status change
      mainOrderEntity.status = MainOrderStatusEnum.CANCELED;
      await this.mainOrderRepository.save(mainOrderEntity);
      for (let i = 0; i < cancelRequest.orderIds.length; i++) {
        let orderEntity = await this.orderRepository.findOne({
          where: {
            id: cancelRequest.orderIds[i],
          },
        });
        //Order status change
        if (orderEntity) {
          orderEntity.status = OrderStatusEnum.CANCELED;
          await this.orderRepository.save(orderEntity);
        }
      }
      return new SuccessModel();
      // cancelRequest.orderIds;
    }

    const orders: Array<OrderEntity> = await mainOrderEntity.orders;
    const pricePerOrder: number = +new Decimal(mainOrderEntity.totalAmount)
      .minus(new Decimal(mainOrderEntity.totalAmount).mul(0.15))
      .div(orders.length)
      .toFixed();

    await this.orderRepository.cancelOrderAsCustomer(
      orders,
      pricePerOrder,
      cancelRequest.reason,
    );

    mainOrderEntity.status = MainOrderStatusEnum.CANCELED;
    await this.mainOrderRepository.save(mainOrderEntity);
    return new SuccessModel();
  }

  async cancelOrder(
    customerEntity: CustomerEntity,
    cancelRequest: CancelOrderRequest,
  ): Promise<SuccessModel> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne({
      where: { id: cancelRequest.id, status: OrderStatusEnum.PENDING },
      relations: ['mainOrder', 'mainOrder.customer'],
    });

    if (!orderEntity) {
      throw new NotFoundException('Order was not found');
    }

    const mainOrderEntity = await orderEntity.mainOrder;
    customerEntity = await mainOrderEntity.customer;

    orderEntity.status = OrderStatusEnum.CANCELED;
    orderEntity.reasonForCancel = 'You canceled this order!';

    const orderCancellationEntity = new OrderCancellationEntity();
    orderCancellationEntity.order = Promise.resolve(orderEntity);
    orderCancellationEntity.type = OrderCancellationEnum.CUSTOMER;
    orderCancellationEntity.reason = cancelRequest.reason;

    //with in 2 Days
    const createdAtAfter2Day: DateTime = DateTime.fromJSDate(
      orderEntity.createdAt,
    ).plus({ day: 2 });

    if (+createdAtAfter2Day > +DateTime.utc()) {
      customerEntity.balance += mainOrderEntity.totalAmount;
      await this.customerRepository.save(customerEntity);
      orderEntity.status = OrderStatusEnum.CANCELED;
      await this.orderRepository.save(orderEntity);
      return new SuccessModel();
    }

    mainOrderEntity.totalAmount = +new Decimal(mainOrderEntity.totalAmount)
      .minus(orderEntity.priceWithExtras)
      .toFixed(2);

    //First Add total order amount
    customerEntity.balance = +new Decimal(customerEntity.balance)
      .plus(orderEntity.priceWithExtras)
      .toFixed(2);
    console.log('customerEntity.balance', customerEntity.balance);

    //15%
    var charges = (15 / 100) * orderEntity.priceWithExtras;
    console.log('===', charges);

    //subtraction of 15% charges
    customerEntity.balance = customerEntity.balance - Math.round(charges);
    console.log('=-=-', customerEntity.balance);

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

  async createExtraMainOrder(
    customerEntity: CustomerEntity,
    createFirstOrderRequest: CreateFirstOrderRequest,
  ): Promise<SuccessModel> {
    const extraServiceEntity = await this.extraServiceRepository.findOne({
      where: { id: createFirstOrderRequest.extraIds },
    });
    if (!extraServiceEntity) {
      throw new NotFoundException('Extras Service was not found!');
    }

    const newOrder = await this.firstOrderRepository.saveFirstOrder(
      {
        dateFrom: createFirstOrderRequest.date,
        status: OrderStatusEnum.PENDING,
        // dateTo: 1650432845,
        // priceWithExtras: 0,
        // holidayFeePrice: 0,
      },
      {
        customer: customerEntity,
        extra: extraServiceEntity,
      },
    );

    const extraViewModel: ExtrasServiceViewModel = await makeExtraServiceViewModel(
      extraServiceEntity,
    );
    // return {
    //   id: newOrder.id,
    //   firstDate: newOrder.dateFrom.getTime(),
    //   extra: extraViewModel,
    //   status: OrderStatusEnum.PENDING,
    // };
    return new SuccessModel();
  }

  async getStatus(customerEntity: CustomerEntity): Promise<StatusResponse> {
    //Status manage
    const freeOrder = await this.firstOrderRepository.findOne({
      where: {
        customer: customerEntity.id,
      },
    });
    //console.log('freeOrder', freeOrder);
    var time = 0;
    var statuss = 0;
    if (!freeOrder) {
      //new User
      statuss = 0;
      time = 0;
    } else if (freeOrder) {
      statuss = 1;
      time = freeOrder.dateFrom.getTime();
      if (statuss === 1) {
        if (freeOrder.status === 'completed') {
          statuss = 2;
        } else if (freeOrder.status === 'canceled') {
          statuss = 3;
        }
      }
    }
    return <StatusResponse>{
      status: statuss,
      time: time,
    };
  }
}
