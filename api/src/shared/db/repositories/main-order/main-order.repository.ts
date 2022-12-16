import {
  Brackets,
  EntityManager,
  EntityRepository,
  Not,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';

import {
  MainOrderStatusEnum,
  OrderPaymentStatusEnum,
  OrderStatusEnum,
} from '@pawfect/db/entities/enums';
import {
  ExtraServiceEntity,
  MainOrderDayEntity,
  MainOrderEntity,
  MainOrderExtraServiceEntity,
  MainOrderPetEntity,
  MainOrderVisitEntity,
  PetEntity,
} from '../../entities';
import {
  SaveMainOrderOptions,
  SaveMainOrderRelations,
  SetSafesRelations,
  SetDaysOptions,
  SetVisitOptions,
} from './interfaces';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(MainOrderEntity)
export class MainOrderRepository extends Repository<MainOrderEntity> {
  constructor(entityManager: EntityManager) {
    super();
  }

  async getMainOrderDetailsAsCustomer(
    customerId: string,
    mainOrderId: string,
  ): Promise<MainOrderEntity | undefined> {
    const query = this.createQueryBuilder('MainOrders')
      .where(
        'MainOrders.customerId = :customerId AND MainOrders.id = :mainOrderId',
        { customerId, mainOrderId },
      )
      .leftJoinAndMapOne(
        'MainOrders.service',
        'Services',
        'Services',
        'MainOrders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhoto',
        'Services.logoId = ServicePhoto.id',
      )
      .leftJoinAndMapMany(
        'MainOrders.visits',
        'MainOrderVisits',
        'Visits',
        'MainOrders.id = Visits.mainOrderId',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .leftJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhoto',
        'PetPhoto.id = Pets.photoId',
      )
      // .leftJoinAndMapMany("MainOrders.orders", "Orders", "Orders", "MainOrders.id = Orders.mainOrderId") //take too many RAM
      .leftJoinAndMapMany(
        'MainOrders.dates',
        'MainOrderDays',
        'MainOrderDays',
        'MainOrders.id = MainOrderDays.mainOrderId AND MainOrderDays.isHoliday = TRUE',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderExtras',
        'MainOrderExtraServices',
        'MainOrderExtraServices',
        'MainOrders.id = MainOrderExtraServices.mainOrderId',
      );

    return query.getOne();
  }

  async getMainOrdersAsCustomer(
    customerId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<MainOrderEntity>> {
    const query = this.createQueryBuilder('MainOrders')
      .leftJoinAndMapOne(
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
      .leftJoinAndMapMany(
        'MainOrders.visits',
        'MainOrderVisits',
        'MainOrderVisits',
        'MainOrders.id = MainOrderVisits.mainOrderId',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .leftJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhoto',
        'PetPhoto.id = Pets.photoId',
      )
      // .leftJoinAndMapMany(
      //   'MainOrders.orders',
      //   'Orders',
      //   'Orders',
      //   'MainOrders.id = Orders.mainOrderId',
      // )
      // .orderBy('Orders.dateFrom', 'ASC') // take many RAM
      .where('MainOrders.customerId = :customerId', { customerId })
      .addOrderBy('MainOrders.createdAt', 'DESC')
      .andWhere('MainOrders.status != :statusConfirmed', {
        statusConfirmed: MainOrderStatusEnum.COMPLETED,
      })
      .andWhere('MainOrders.status != :statusCancel', {
        statusCancel: MainOrderStatusEnum.CANCELED,
      });

    const paginateMainOrder = await paginate(query, paginationOptions);
    return paginateMainOrder;
  }

  async getMainOrdersAsAdmin(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<MainOrderEntity>> {
    const query = this.createQueryBuilder('MainOrders')
      .leftJoinAndMapOne(
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
      .leftJoinAndMapMany(
        'MainOrders.visits',
        'MainOrderVisits',
        'MainOrderVisits',
        'MainOrders.id = MainOrderVisits.mainOrderId',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .leftJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhoto',
        'PetPhoto.id = Pets.photoId',
      )
      // .leftJoinAndMapMany(
      //   'MainOrders.orders',
      //   'Orders',
      //   'Orders',
      //   'MainOrders.id = Orders.mainOrderId',
      // )
      // .orderBy('Orders.dateFrom', 'ASC') // take many RAM
      .addOrderBy('MainOrders.createdAt', 'DESC')
      .andWhere('MainOrders.status != :statusCompleted', {
        statusCompleted: MainOrderStatusEnum.COMPLETED,
      })
      .andWhere('MainOrders.status != :statusComfirmed', {
        statusComfirmed: MainOrderStatusEnum.CONFIRMED,
      })
      .andWhere('MainOrders.status != :statusInprogress', {
        statusInprogress: MainOrderStatusEnum.IN_PROGRESS,
      })
      .andWhere('MainOrders.status != :statusCancel', {
        statusCancel: MainOrderStatusEnum.CANCELED,
      });

    const paginateMainOrder = await paginate(query, paginationOptions);
    return paginateMainOrder;
  }

  async getConfirmedMainOrdersAsAdmin(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<MainOrderEntity>> {
    const query = this.createQueryBuilder('MainOrders')
      .leftJoinAndMapOne(
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
      .leftJoinAndMapMany(
        'MainOrders.visits',
        'MainOrderVisits',
        'MainOrderVisits',
        'MainOrders.id = MainOrderVisits.mainOrderId',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .leftJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhoto',
        'PetPhoto.id = Pets.photoId',
      )
      .leftJoinAndMapMany(
        'MainOrders.orders',
        'Orders',
        'Orders',
        'MainOrders.id = Orders.mainOrderId',
      )
      .leftJoinAndMapOne(
        'Orders.orderPayments',
        'OrderPayments',
        'OrderPayments',
        'Orders.id = OrderPayments.order',
      )
      // .orderBy('Orders.dateFrom', 'ASC') // take many RAM
      .addOrderBy('MainOrders.createdAt', 'DESC')
      .andWhere(
        new Brackets((db) => {
          db.where('MainOrders.status != :statusPending', {
            statusPending: MainOrderStatusEnum.PENDING,
          });
          db.andWhere('MainOrders.status != :statusCancel', {
            statusCancel: MainOrderStatusEnum.CANCELED,
          });
        }),
      )
      .andWhere('Orders.status = :statusConfirmed', {
        statusConfirmed: OrderStatusEnum.CONFIRMED,
      })
      .andWhere('OrderPayments.status = :status', {
        status: OrderPaymentStatusEnum.PENDING,
      });

    const paginateMainOrder = await paginate(query, paginationOptions);
    return paginateMainOrder;
  }

  async getMainOrderDetailsAsAdmin(
    mainOrderId: string,
  ): Promise<MainOrderEntity | undefined> {
    const query = this.createQueryBuilder('MainOrders')
      .where('MainOrders.id = :mainOrderId', { mainOrderId })
      .leftJoinAndMapOne(
        'MainOrders.service',
        'Services',
        'Services',
        'MainOrders.serviceId = Services.id',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'ServicePhoto',
        'Services.logoId = ServicePhoto.id',
      )
      .leftJoinAndMapMany(
        'MainOrders.visits',
        'MainOrderVisits',
        'Visits',
        'MainOrders.id = Visits.mainOrderId',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderPets',
        'MainOrderPets',
        'MainOrderPets',
        'MainOrders.id = MainOrderPets.mainOrderId',
      )
      .leftJoinAndMapOne(
        'MainOrderPets.pet',
        'Pets',
        'Pets',
        'MainOrderPets.petId = Pets.id',
      )
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'PetPhoto',
        'PetPhoto.id = Pets.photoId',
      )
      // .leftJoinAndMapMany("MainOrders.orders", "Orders", "Orders", "MainOrders.id = Orders.mainOrderId") //take too many RAM
      .leftJoinAndMapMany(
        'MainOrders.dates',
        'MainOrderDays',
        'MainOrderDays',
        'MainOrders.id = MainOrderDays.mainOrderId AND MainOrderDays.isHoliday = TRUE',
      )
      .leftJoinAndMapMany(
        'MainOrders.mainOrderExtras',
        'MainOrderExtraServices',
        'MainOrderExtraServices',
        'MainOrders.id = MainOrderExtraServices.mainOrderId',
      );

    return query.getOne();
  }

  async saveMainOrder(
    saveMainOrderOptions: SaveMainOrderOptions,
    relations: SaveMainOrderRelations,
  ): Promise<MainOrderEntity> {
    const newMainOrder = new MainOrderEntity();
    newMainOrder.totalAmount = saveMainOrderOptions.totalAmountSafe;
    newMainOrder.firstDate = saveMainOrderOptions.startedDate.toJSDate();
    newMainOrder.lastDate = saveMainOrderOptions.endedDate.toJSDate();
    newMainOrder.comment = saveMainOrderOptions.comment || null;
    newMainOrder.status = MainOrderStatusEnum.PENDING;

    newMainOrder.customer = Promise.resolve(relations.customer);
    newMainOrder.service = Promise.resolve(relations.service);

    await this.save(newMainOrder);
    return newMainOrder;
  }

  async setDays(
    mainOrderEntity: MainOrderEntity,
    days: Array<SetDaysOptions>,
  ): Promise<Array<MainOrderDayEntity>> {
    const mainOrderDayEntities: Array<MainOrderDayEntity> = new Array<MainOrderDayEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const day of days) {
        const dayEntity = new MainOrderDayEntity();
        dayEntity.price = day.amount;
        dayEntity.isHoliday = day.isHoliday;
        dayEntity.dateFrom = day.dateFrom.toJSDate();
        dayEntity.dateTo = day.dateTo.toJSDate();
        dayEntity.mainOrder = Promise.resolve(mainOrderEntity);

        mainOrderDayEntities.push(dayEntity);
      }

      await queryRunner.manager.save(mainOrderDayEntities);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return mainOrderDayEntities;
  }

  async setPets(
    mainOrderEntity: MainOrderEntity,
    petsEntities: Array<PetEntity>,
  ): Promise<Array<MainOrderPetEntity>> {
    const mainOrderPetEntities: Array<MainOrderPetEntity> = new Array<MainOrderPetEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const petEntity of petsEntities) {
        const mainOrderPetEntity: MainOrderPetEntity = new MainOrderPetEntity();
        mainOrderPetEntity.pet = Promise.resolve(petEntity);
        mainOrderPetEntity.mainOrder = Promise.resolve(mainOrderEntity);
        mainOrderPetEntities.push(mainOrderPetEntity);
      }

      await queryRunner.manager.save(mainOrderPetEntities);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return mainOrderPetEntities;
  }

  async setVisits(
    mainOrderEntity: MainOrderEntity,
    visits: Array<SetVisitOptions>,
  ): Promise<Array<MainOrderVisitEntity>> {
    const mainOrderPetEntities: Array<MainOrderVisitEntity> = new Array<MainOrderVisitEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const visit of visits) {
        const visitEntity: MainOrderVisitEntity = new MainOrderVisitEntity();
        visitEntity.mainOrder = Promise.resolve(mainOrderEntity);
        visitEntity.timeFrom = visit.timeFrom.toJSDate();
        visitEntity.timeTo = visit.timeTo.toJSDate();
        visitEntity.type = visit.type;

        mainOrderPetEntities.push(visitEntity);
      }

      await queryRunner.manager.save(mainOrderPetEntities);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return mainOrderPetEntities;
  }

  async setExtras(
    mainOrderEntity: MainOrderEntity,
    extraServiceEntities: Array<ExtraServiceEntity>,
  ): Promise<void> {
    const mainOrderPetEntities: Array<MainOrderExtraServiceEntity> = new Array<MainOrderExtraServiceEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const extraServiceEntity of extraServiceEntities) {
        const orderExtraServiceEntity: MainOrderExtraServiceEntity = new MainOrderExtraServiceEntity();
        orderExtraServiceEntity.mainOrder = Promise.resolve(mainOrderEntity);
        orderExtraServiceEntity.extraService = Promise.resolve(
          extraServiceEntity,
        );
        orderExtraServiceEntity.price = extraServiceEntity.price;

        mainOrderPetEntities.push(orderExtraServiceEntity);
      }

      await queryRunner.manager.save(mainOrderPetEntities);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMainOrderForCancel(
    mainOrderId: string,
    customerId: string,
  ): Promise<MainOrderEntity | undefined> {
    const query = this.createQueryBuilder('MainOrders')
      .leftJoinAndMapMany(
        'MainOrders.orders',
        'Orders',
        'Orders',
        'MainOrders.id = Orders.mainOrderId',
      )
      .where('MainOrders.id = :mainOrderId', { mainOrderId: mainOrderId })
      .andWhere('MainOrders.customerId = :customerId', {
        customerId: customerId,
      })
      .andWhere(
        '(MainOrders.status != :statusComplete AND MainOrders.status != :statusCanceled)',
        {
          statusComplete: MainOrderStatusEnum.COMPLETED,
          statusCanceled: MainOrderStatusEnum.CANCELED,
        },
      );

    return query.getOne();
  }

  async petHasActiveMainOrder(petId: string): Promise<boolean> {
    const query = this.createQueryBuilder('MainOrders')
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
      .where('Pets.id = :petId', { petId: petId })
      .andWhere(
        '(MainOrders.status != :canceledStatus AND MainOrders.status != :completedStatus)',
        {
          canceledStatus: MainOrderStatusEnum.CANCELED,
          completedStatus: MainOrderStatusEnum.COMPLETED,
        },
      );

    const mainOrder = await query.getOne();

    return !!mainOrder;
  }
}
