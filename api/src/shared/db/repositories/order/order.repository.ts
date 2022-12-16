import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets, EntityManager, EntityRepository, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import {
  OrderCancellationEnum,
  OrderPaymentStatusEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';
import {
  CustomerEntity,
  EmployeeRatingEntity,
  FreeOrderEntity,
  MainOrderEntity,
  OrderCancellationEntity,
  OrderCheckEntity,
  OrderEntity,
  ServiceEntity,
  UserEntity,
  OrderPaymentEntity,
} from '@pawfect/db/entities';
import {
  CreateBulkWithChecksOptions,
  GetConfirmedOrdersOptions,
} from './interfaces';
import { PaginationRequest } from '@pawfect/models';
import Decimal from 'decimal.js';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  private readonly orderCancellationRepository: Repository<OrderCancellationEntity>;
  private readonly employeeRatingRepository: Repository<EmployeeRatingEntity>;

  constructor(entityManager: EntityManager) {
    super();
    this.orderCancellationRepository = entityManager.getRepository(
      OrderCancellationEntity,
    );
    this.employeeRatingRepository = entityManager.getRepository(
      EmployeeRatingEntity,
    );
  }

  async getByRange(
    startedDate: number,
    endedDate: number,
    status: OrderStatusEnum,
  ): Promise<Array<OrderEntity>> {
    // console.log('user_input===>', startedDate);

    const startDateTime: DateTime = DateTime.fromMillis(startedDate).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    // console.log('ater_conversion===>', startDateTime);
    // console.log('endDate===>', endedDate);
    const endDateTime: DateTime = DateTime.fromMillis(endedDate).set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });
    // console.log('ater_conversion_end===>', endDateTime);

    const query = this.createQueryBuilder('Orders')
      // .where("Orders.status = :status", { status })
      .andWhere('Orders.isEmployeeAccepted = :isEmployeeAccepted', {
        isEmployeeAccepted: true,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :confirmedStatus', {
            confirmedStatus: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :inprogressStatus', {
            inprogressStatus: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom < :dateTo::timestamp)',
            {
              dateFrom: startDateTime,
              dateTo: endDateTime,
            },
          )
            .orWhere(
              '(Orders.dateTo > :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
              {
                dateFrom: startDateTime,
                dateTo: endDateTime,
              },
            )
            .orWhere(
              '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
              {
                dateFrom: startDateTime,
                dateTo: endDateTime,
              },
            );
        }),
      );
    // .andWhere(
    //   new Brackets((qb) => {
    //     qb.where(
    //       '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
    //       {
    //         dateFrom: startDateTime,
    //         dateTo: endDateTime,
    //       },
    //     )
    //       // .orWhere(
    //       //   '(Orders.dateTo >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
    //       //   {
    //       //     dateFrom: startDateTime,
    //       //     dateTo: endDateTime,
    //       //   },
    //       // )
    //       .orWhere(
    //         '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom <= :dateTo::timestamp)',
    //         {
    //           dateFrom: startDateTime,
    //           dateTo: endDateTime,
    //         },
    //       );
    //   }),
    // );
    // console.log(
    //   'Total_number_of_orders',
    //   (await paginate(query, { limit: 20, page: 1 })).meta.totalItems,
    // );
    const ordersEntities = await query.getMany();

    return ordersEntities;
  }

  async getNewOrdersAsAdmin(
    paginationRequest: IPaginationOptions,
    date: Date,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .leftJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Orders.employeeId = Employees.id',
      )
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .innerJoinAndMapOne(
        'Orders.orderPayments',
        'OrderPayments',
        'OrderPayments',
        'Orders.id = OrderPayments.order',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerAvatar',
        'Customers.avatarId = CustomerAvatar.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'Photos',
        'Pets.photoId = Photos.id',
      )
      .where('Orders.status = :statusConfirmed', {
        statusConfirmed: OrderStatusEnum.CONFIRMED,
      })
      .andWhere('Orders.dateFrom < :limit', {
        limit: date,
      })
      .andWhere('OrderPayments.status = :status', {
        status: OrderPaymentStatusEnum.PENDING,
      })
      .orderBy({ 'Orders.updatedAt': 'DESC' });

    return paginate(query, paginationRequest);
  }

  async getUpcomingOrdersAsCustomer(
    customerId: string,
    date: number,
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const startDate: DateTime = DateTime.fromMillis(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const endDate: DateTime = startDate.plus({ day: 1 }).minus({ second: 1 });
    console.log('Date==>', startDate);
    console.log('JS_date===>', startDate.toJSDate());

    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .leftJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Orders.employeeId = Employees.id',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .where('MainOrders.customerId = :customerId', { customerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom <= :dateTo::timestamp)',
            { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
          )
            .orWhere(
              '(Orders.dateTo >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            )
            .orWhere(
              '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            );
        }),
      )
      .orderBy('Orders.dateFrom', 'ASC');

    const queryResult = await paginate(query, paginationRequest);
    return queryResult;
  }

  async getUpcomingOrderDetailsAsCustomer(
    customerId: string,
    orderId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('MainOrders.customerId = :customerId', { customerId })
      .andWhere('Orders.id = :orderId', { orderId });

    const queryResult = await query.getOne();
    return queryResult;
  }

  async createBulkWithChecks(
    createBulkOptions: CreateBulkWithChecksOptions,
    relations: {
      mainOrder: MainOrderEntity;
      service: ServiceEntity;
      // customer: CustomerEntity;
    },
    orderDates: any,
  ): Promise<Array<OrderEntity>> {
    const orders: Array<OrderEntity> = new Array<OrderEntity>();
    // const amountPerOrder: Decimal = new Decimal(totalAmountSafe).div(
    //   createBulkOptions.dates.length,
    // );

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const [index, orderDate] of createBulkOptions.dates.entries()) {
        const orderEntity = new OrderEntity();

        orderEntity.priceWithExtras = orderDates[index].amount;
        orderEntity.holidayFeePrice = createBulkOptions.holidayFee;
        orderEntity.comment = createBulkOptions.comment || null;
        orderEntity.status = OrderStatusEnum.PENDING;
        orderEntity.dateFrom = orderDate.dateFrom.toJSDate();
        orderEntity.dateTo = orderDate.dateTo.toJSDate();
        orderEntity.service = Promise.resolve(relations.service);
        orderEntity.mainOrder = Promise.resolve(relations.mainOrder);
        // orderEntity.customer = Promise.resolve(relations.customer);
        orders.push(orderEntity);
        await queryRunner.manager.save(orderEntity);

        // creating a order payment entry for every-order
        const orderPayment = new OrderPaymentEntity();
        orderPayment.order = Promise.resolve(orderEntity);
        await queryRunner.manager.save(orderPayment);

        for (const serviceCheck of createBulkOptions.serviceChecks) {
          const orderCheckEntity = new OrderCheckEntity();
          orderCheckEntity.numOrder = serviceCheck.numOrder;
          orderCheckEntity.name = serviceCheck.name;
          orderCheckEntity.duration = serviceCheck.duration;
          orderCheckEntity.order = Promise.resolve(orderEntity);
          await queryRunner.manager.save(orderCheckEntity);
        }
      }

      await queryRunner.commitTransaction();
      console.log('----------------------Addd----------');
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return orders;
  }

  async cancelOrderAsCustomer(
    orders: Array<OrderEntity>,
    pricePerOrder: number,
    reason?: string,
  ): Promise<void> {
    const queryRunner = this.manager.connection.createQueryRunner();

    await queryRunner.connect(); // TODO 09.04.21: rewrite to TransactionManager
    await queryRunner.startTransaction();
    try {
      const orderCancellations: Array<OrderCancellationEntity> = new Array<OrderCancellationEntity>();
      for (const order of orders) {
        order.status = OrderStatusEnum.CANCELED;
        await queryRunner.manager.save(order);

        const orderCancellationEntity = new OrderCancellationEntity();
        orderCancellationEntity.reason = reason;
        orderCancellationEntity.order = Promise.resolve(order);
        orderCancellationEntity.type = OrderCancellationEnum.CUSTOMER;

        orderCancellations.push(orderCancellationEntity);
        await queryRunner.manager.save(orderCancellations);
      }

      await queryRunner.manager.save(orderCancellations);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 23.03.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getNewOrdersByEmployeeAsEmployee(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    return paginate(this, paginationOptions, {
      where: { employee: employeeId, status: OrderStatusEnum.PENDING },
      relations: [
        'mainOrder',
        'mainOrder.customer',
        'mainOrder.mainOrderPets',
        'mainOrder.mainOrderPets.pet',
      ],
    });
  }

  async getConfirmedOrdersAsEmployee(
    employeeId: string,
    paginationOptions: GetConfirmedOrdersOptions,
  ): Promise<Pagination<OrderEntity>> {
    const startDate: DateTime = DateTime.fromMillis(
      paginationOptions.date,
    ).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endDate: DateTime = startDate.plus({ day: 1 }).minus({ second: 1 });

    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('Orders.employeeId = :employeeId', { employeeId })
      .andWhere('Orders.status = :status', {
        status: OrderStatusEnum.CONFIRMED,
      })
      .addOrderBy('Orders.dateFrom', 'ASC')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom <= :dateTo::timestamp)',
            { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
          )
            .orWhere(
              '(Orders.dateTo >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            )
            .orWhere(
              '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            );
        }),
      );

    const paginateResult = await paginate(query, paginationOptions);
    return paginateResult;
  }

  async getMapOrdersAsEmployee(
    employeeId: string,
  ): Promise<Array<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('Orders.employeeId = :employeeId', { employeeId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusConfirmed', {
            statusConfirmed: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :statusInProgress', {
            statusInProgress: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          //TODO: CHECK ON TODAY
          qb.where(
            "(Orders.dateFrom - CURRENT_TIMESTAMP(0)::TIMESTAMP WITHOUT TIME ZONE < interval '2 day')",
          ).andWhere(
            "(Orders.dateFrom - CURRENT_TIMESTAMP(0)::TIMESTAMP WITHOUT TIME ZONE > interval '-1 day')",
          );
        }),
      )
      .orderBy('Orders.dateFrom', 'ASC');

    const paginateResult = await query.getMany();
    return paginateResult;
  }

  async getMapOrdersAsCustomer(
    customerId: string,
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('MainOrders.customerId = :customerId', { customerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusConfirmed', {
            statusConfirmed: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :statusInProgress', {
            statusInProgress: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          //TODO: CHECK ON TODAY
          qb.where(
            "(Orders.dateFrom - CURRENT_TIMESTAMP(0)::TIMESTAMP WITHOUT TIME ZONE < interval '2 day')",
          ).andWhere(
            "(Orders.dateFrom - CURRENT_TIMESTAMP(0)::TIMESTAMP WITHOUT TIME ZONE > interval '-1 day')",
          );
        }),
      );
    // .andWhere(
    //   new Brackets((qb) => {
    //     qb.where("(Orders.dateFrom - now() < interval '2 day')").andWhere(
    //       "(Orders.dateFrom - now() > interval '0 day')",
    //     );
    //   }),
    // );

    const paginateResult = await paginate(query, paginationRequest);
    return paginateResult;
  }

  async getOrderWithChecklist(
    employeeId: string,
    orderId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .where('Orders.employeeId = :employeeId', { employeeId })
      .andWhere('Orders.id = :orderId', { orderId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusConfirmed', {
            statusConfirmed: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :statusInProgress', {
            statusInProgress: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      .orderBy('OrderChecks.numOrder', 'ASC');

    const orderEntity = await query.getOne();
    return orderEntity;
  }

  async getMapOrderDetailsAsCustomer(
    customerId: string,
    orderId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Orders.employeeId = Employees.id',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'EmployeePhotos.id = Employees.avatarId',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.logo',
        'Photos',
        'OrderCheckPhotos',
        'OrderCheckPhotos.id = OrderChecks.logoId',
      )
      .leftJoinAndMapMany(
        'OrderChecks.actions',
        'OrderCheckActions',
        'OrderCheckActions',
        'OrderChecks.id = OrderCheckActions.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.attachment',
        'OrderCheckAttachments',
        'OrderCheckAttachments',
        'OrderChecks.id = OrderCheckAttachments.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderCheckAttachments.photo',
        'Photos',
        'AttachmentPhotos',
        'AttachmentPhotos.id = OrderCheckAttachments.photoId',
      )
      .where('MainOrders.customerId = :customerId', { customerId })
      .andWhere('Orders.id = :orderId', { orderId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusConfirmed', {
            statusConfirmed: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :statusInProgress', {
            statusInProgress: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      );

    const orderEntity = await query.getOne();

    return orderEntity;
  }

  async getMyHistoriesAsCustomer(
    customerId: string,
    paginationRequest: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'MainOrders.id = Orders.mainOrderId',
      )
      // .innerJoinAndMapOne(
      //   'Orders.employee',
      //   'Employees',
      //   'Employees',
      //   'Orders.employeeId = Employees.id',
      // )
      // .leftJoinAndMapOne(
      //   'Employees.avatar',
      //   'Photos',
      //   'EmployeePhotos',
      //   'Employees.avatarId = EmployeePhotos.id',
      // )
      .innerJoinAndMapOne(
        'MainOrders.service',
        'Services',
        'Services',
        'MainOrders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('MainOrders.customerId = :customerId', { customerId })
      .orderBy('MainOrders.createdAt', 'DESC')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.status != :statusConfirmed AND Orders.status != :statusPENDING AND Orders.status != :statusIN_PROGRESS)',
            {
              statusConfirmed: OrderStatusEnum.CONFIRMED,
              statusPENDING: OrderStatusEnum.PENDING,
              statusIN_PROGRESS: OrderStatusEnum.IN_PROGRESS,
            },
          );
        }),
      );

    // .andWhere(œ™™™¡
    //   '(Orders.status != :statusCONFIRMED AND Orders.status != :statusPENDING AND Orders.status != :statusIN_PROGRESS AND Orders.status = :statusCOMPLETED AND Orders.status = :statusCANCELED)',
    //   {
    //     statusCONFIRMED: OrderStatusEnum.CONFIRMED,
    //     statusPENDING: OrderStatusEnum.PENDING,
    //     statusIN_PROGRESS: OrderStatusEnum.IN_PROGRESS,
    //     statusCOMPLETED: OrderStatusEnum.COMPLETED,
    //     statusCANCELED: OrderStatusEnum.CANCELED,
    //   },
    // );

    // .andWhere('Orders.status = :status', {
    //   status: OrderStatusEnum.CANCELED,
    // })
    // .andWhere('Orders.status = :statusCompleted', {
    //   statusCompleted: OrderStatusEnum.COMPLETED,
    // });

    const paginateOrders = await paginate(query, paginationRequest);
    return paginateOrders;
  }

  async getHistoryDetailsAsCustomer(
    orderId: string,
    customerId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      // .innerJoinAndMapOne(
      //   'Orders.employee',
      //   'Employees',
      //   'Employees',
      //   'Orders.employeeId = Employees.id',
      // )
      // .leftJoinAndMapOne(
      //   'Employees.avatar',
      //   'Photos',
      //   'EmployeePhotos',
      //   'Employees.avatarId = EmployeePhotos.id',
      // )
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.logo',
        'Photos',
        'OrderCheckPhoto',
        'OrderChecks.logo = OrderCheckPhoto.id',
      )
      .leftJoinAndMapMany(
        'OrderChecks.actions',
        'OrderCheckActions',
        'OrderCheckActions',
        'OrderChecks.id = OrderCheckActions.orderCheckId',
      )
      .leftJoinAndMapMany(
        'OrderChecks.attachments',
        'OrderCheckAttachments',
        'OrderCheckAttachments',
        'OrderChecks.id = OrderCheckAttachments.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderCheckAttachments.photo',
        'Photos',
        'CheckAttachmentPhoto',
        'OrderCheckAttachments.photoId = CheckAttachmentPhoto.id',
      )
      // .orderBy('Orders.OrderChecks.actions.createdAt', 'ASC')
      .where('Orders.id = :orderId', { orderId })
      .andWhere('MainOrders.customerId = :customerId', { customerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.status != :statusConfirmed AND Orders.status != :statusPENDING AND Orders.status != :statusIN_PROGRESS)',
            {
              statusConfirmed: OrderStatusEnum.CONFIRMED,
              statusPENDING: OrderStatusEnum.PENDING,
              statusIN_PROGRESS: OrderStatusEnum.IN_PROGRESS,
            },
          );
        }),
      );
    // .andWhere('Orders.status = :status', {
    //   status: OrderStatusEnum.COMPLETED,
    // })
    // .andWhere('Orders.status = :status', {
    //   status: OrderStatusEnum.CANCELED,
    // });

    const orderEntity = await query.getOne();

    return orderEntity;
  }

  async getMyHistoriesAsEmployee(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'MainOrders.id = Orders.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.service',
        'Services',
        'Services',
        'MainOrders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('Orders.employeeId = :employeeId', { employeeId })
      .orderBy('Orders.createdAt', 'DESC')
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusCompleted', {
            statusCompleted: OrderStatusEnum.COMPLETED,
          }).orWhere('Orders.status = :statusInCancled', {
            statusInCancled: OrderStatusEnum.CANCELED,
          });
        }),
      );
    // .andWhere('Orders.status = :status', {
    //   status: OrderStatusEnum.COMPLETED,
    // });

    const paginationOrders = await paginate(query, paginationOptions);

    return paginationOrders;
  }

  async getHistoryDetailsAsEmployee(
    employeeId: string,
    orderId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.logo',
        'Photos',
        'OrderCheckPhoto',
        'OrderChecks.logo = OrderCheckPhoto.id',
      )
      .leftJoinAndMapMany(
        'OrderChecks.actions',
        'OrderCheckActions',
        'OrderCheckActions',
        'OrderChecks.id = OrderCheckActions.orderCheckId',
      )
      .leftJoinAndMapMany(
        'OrderChecks.attachments',
        'OrderCheckAttachments',
        'OrderCheckAttachments',
        'OrderChecks.id = OrderCheckAttachments.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderCheckAttachments.photo',
        'Photos',
        'CheckAttachmentPhoto',
        'OrderCheckAttachments.photoId = CheckAttachmentPhoto.id',
      )
      .where('Orders.id = :orderId', { orderId })
      .andWhere('Orders.employeeId = :employeeId', { employeeId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :statusCompleted', {
            statusCompleted: OrderStatusEnum.COMPLETED,
          }).orWhere('Orders.status = :statusInCancled', {
            statusInCancled: OrderStatusEnum.CANCELED,
          });
        }),
      );
    // .andWhere('Orders.status = :status', {
    //   status: OrderStatusEnum.COMPLETED,
    // });

    const orderEntity = await query.getOne();

    return orderEntity;
  }

  async findByIdAndCustomerId(
    orderId: string,
    customerId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .where('Orders.id = :orderId', { orderId })
      .andWhere('Orders.status = :status', {
        status: OrderStatusEnum.COMPLETED,
      })
      .andWhere('Customers.id = :customerId', { customerId });

    const orderEntity = await query.getOne();
    return orderEntity;
  }

  async getInProgressOrders(
    paginationOptions: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<Pagination<OrderEntity>> {
    const searchTerm = name.name;
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Employees.id = Orders.employeeId',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.logo',
        'Photos',
        'OrderCheckPhoto',
        'OrderChecks.logo = OrderCheckPhoto.id',
      )
      .leftJoinAndMapMany(
        'OrderChecks.actions',
        'OrderCheckActions',
        'OrderCheckActions',
        'OrderChecks.id = OrderCheckActions.orderCheckId',
      )
      .leftJoinAndMapMany(
        'OrderChecks.attachments',
        'OrderCheckAttachments',
        'OrderCheckAttachments',
        'OrderChecks.id = OrderCheckAttachments.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderCheckAttachments.photo',
        'Photos',
        'CheckAttachmentPhoto',
        'OrderCheckAttachments.photoId = CheckAttachmentPhoto.id',
      )
      .where('Orders.status = :status', {
        status: OrderStatusEnum.IN_PROGRESS,
      })
      .andWhere('Employees.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

    const paginateOrders = await paginate(query, paginationOptions);
    return paginateOrders;
  }

  async getInProgressOrderDetails(
    orderId: string,
  ): Promise<OrderEntity | undefined> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Employees.id = Orders.employeeId',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .innerJoinAndMapMany(
        'Orders.orderChecks',
        'OrderChecks',
        'OrderChecks',
        'Orders.id = OrderChecks.orderId',
      )
      .leftJoinAndMapOne(
        'OrderChecks.logo',
        'Photos',
        'OrderCheckPhoto',
        'OrderChecks.logo = OrderCheckPhoto.id',
      )
      .leftJoinAndMapMany(
        'OrderChecks.actions',
        'OrderCheckActions',
        'OrderCheckActions',
        'OrderChecks.id = OrderCheckActions.orderCheckId',
      )
      .leftJoinAndMapMany(
        'OrderChecks.attachments',
        'OrderCheckAttachments',
        'OrderCheckAttachments',
        'OrderChecks.id = OrderCheckAttachments.orderCheckId',
      )
      .leftJoinAndMapOne(
        'OrderCheckAttachments.photo',
        'Photos',
        'CheckAttachmentPhoto',
        'OrderCheckAttachments.photoId = CheckAttachmentPhoto.id',
      )
      .where('Orders.id = :orderId', { orderId: orderId })
      .andWhere('Orders.status = :status', {
        status: OrderStatusEnum.IN_PROGRESS,
      });

    const orderEntity = await query.getOne();
    return orderEntity;
  }

  async getHistoryOrders(
    paginationOptions: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<Pagination<OrderEntity>> {
    const searchTerm = name.name;
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Employees.id = Orders.employeeId',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .where('Orders.status = :status', { status: OrderStatusEnum.COMPLETED })
      .andWhere('Employees.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });

    const paginateOrders = await paginate(query, paginationOptions);
    return paginateOrders;
  }

  async findOrdersByDay(
    employeeId: string,
    date: number,
  ): Promise<Array<OrderEntity>> {
    // const day = DateTime.fromMillis(date).set({
    //   hour: 0,
    //   minute: 0,
    //   second: 0,
    //   millisecond: 0,
    // });
    const startDateTime: DateTime = DateTime.fromMillis(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const endDateTime: DateTime = DateTime.fromMillis(date).set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Services.id = Orders.serviceId',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Employees.id = Orders.employeeId',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )

      .where('Orders.employeeId = :employeeId', { employeeId })
      // .andWhere(
      //   `(DATE_TRUNC('day', "Orders"."dateFrom")::timestamp <= :date::timestamp AND DATE_TRUNC('day', "Orders"."dateTo")::timestamp >= :date::timestamp)`,
      //   { date: day.toJSDate() },
      // )
      // .andWhere(
      //   `(DATE_TRUNC('day', "Orders"."dateFrom")::timestamp >= CURRENT_TIMESTAMP)`,
      // )
      // .andWhere('Orders.isEmployeeAccepted = :isEmployeeAccepted', {
      //   isEmployeeAccepted: true,
      // })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :confirmedStatus', {
            confirmedStatus: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :inprogressStatus', {
            inprogressStatus: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      .orderBy('Orders.dateFrom', 'ASC')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom <= :dateTo::timestamp)',
            {
              dateFrom: startDateTime.toJSDate(),
              dateTo: endDateTime.toJSDate(),
            },
          )
            .orWhere(
              '(Orders.dateTo >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
              {
                dateFrom: startDateTime.toJSDate(),
                dateTo: endDateTime.toJSDate(),
              },
            )
            .orWhere(
              '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
              {
                dateFrom: startDateTime.toJSDate(),
                dateTo: endDateTime.toJSDate(),
              },
            );
        }),
      );

    const orders = await query.getMany();
    return orders;
  }

  async getTransactionHistoryOrders(
    customerId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .where('MainOrders.customerId = :customerId', { customerId });
    // .innerJoinAndMapMany(
    //   'MainOrders.customer',
    //   'Customers',
    //   'Customers',
    //   'MainOrders.id = Customers.mainOrderId',
    // );
    // .leftJoinAndMapOne(
    //   'Pets.photo',
    //   'Photos',
    //   'PetPhotos',
    //   'Pets.photoId = PetPhotos.id',
    // )
    // .innerJoinAndMapOne(
    //   'Orders.employee',
    //   'Employees',
    //   'Employees',
    //   'Employees.id = Orders.employeeId',
    // )
    // .leftJoinAndMapOne(
    //   'Employees.avatar',
    //   'Photos',
    //   'EmployeePhotos',
    //   'Employees.avatarId = EmployeePhotos.id',
    // )
    // .where('Orders. = :status', { status: OrderStatusEnum.COMPLETED });

    const paginateOrders = await paginate(query, paginationOptions);
    return paginateOrders;
  }

  async getConfirmedOrdersAsAdminEmployee(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<OrderEntity>> {
    let dates = new Date().getTime();
    const startDate: DateTime = DateTime.fromMillis(dates).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const endDate: DateTime = startDate.plus({ day: 100 }).minus({ second: 1 });
    const query = this.createQueryBuilder('Orders')
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Orders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrderPets.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .where('Orders.employeeId = :employeeId', { employeeId })
      .andWhere('Orders.status = :status', {
        status: OrderStatusEnum.CONFIRMED,
      })
      .addOrderBy('Orders.dateFrom', 'ASC')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom <= :dateTo::timestamp)',
            { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
          )
            .orWhere(
              '(Orders.dateTo >= :dateFrom::timestamp AND Orders.dateTo <= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            )
            .orWhere(
              '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            );
        }),
      );

    const paginateResult = await paginate(query, paginationOptions);
    return paginateResult;
  }

  async getByDayRange(
    date: number,
    status: OrderStatusEnum,
  ): Promise<Array<OrderEntity>> {
    console.log('date_from_user===>', date);

    // const start = new Date(date).setHours(0, 0, 0, 0);
    const startDateTime: DateTime = DateTime.fromMillis(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const endDateTime: DateTime = DateTime.fromMillis(date).set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });
    // console.log(
    //   'start_date_===>',
    //   startDateTime.toFormat('yyyy-MM-dd hh:mm:ss'),
    // );
    // console.log('end_date_===>', endDateTime.toFormat('yyyy-MM-dd hh:mm:ss'));

    const query = this.createQueryBuilder('Orders')
      .andWhere('Orders.isEmployeeAccepted = :isEmployeeAccepted', {
        isEmployeeAccepted: true,
      })
      .innerJoinAndMapOne(
        'Orders.service',
        'Services',
        'Services',
        'Services.id = Orders.serviceId',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhotos',
        'Services.logoId = ServicePhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.mainOrder',
        'MainOrders',
        'MainOrders',
        'Orders.mainOrderId = MainOrders.id',
      )
      .innerJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .innerJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhotos',
        'Pets.photoId = PetPhotos.id',
      )
      .innerJoinAndMapOne(
        'Orders.employee',
        'Employees',
        'Employees',
        'Employees.id = Orders.employeeId',
      )
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .innerJoinAndMapOne(
        'MainOrders.customer',
        'Customers',
        'Customers',
        'MainOrders.customerId = Customers.id',
      )
      .leftJoinAndMapOne(
        'Customers.avatar',
        'Photos',
        'CustomerPhotos',
        'Customers.avatarId = CustomerPhotos.id',
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('Orders.status = :confirmedStatus', {
            confirmedStatus: OrderStatusEnum.CONFIRMED,
          }).orWhere('Orders.status = :inprogressStatus', {
            inprogressStatus: OrderStatusEnum.IN_PROGRESS,
          });
        }),
      )
      // .where("Orders.status = :status", { status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateTo < :dateTo::timestamp)',
            {
              dateFrom: startDateTime,
              dateTo: endDateTime,
            },
          )
            // .orWhere('(Orders.dateTo >= :dateFrom::timestamp)', {
            //   dateFrom: startDateTime,
            //   dateTo: endDateTime,
            // })
            .orWhere(
              '(Orders.dateFrom >= :dateFrom::timestamp AND Orders.dateFrom < :dateTo::timestamp)',
              {
                dateFrom: startDateTime,
                dateTo: endDateTime,
              },
            );
        }),
      );
    // console.log(query.getQuery());
    console.log(
      'number_of_orders',
      (await paginate(query, { limit: 20, page: 1 })).meta.totalItems,
    );

    const ordersEntities = await query.getMany();

    return ordersEntities;
  }
}
