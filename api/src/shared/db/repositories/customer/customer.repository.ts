import { EntityManager, EntityRepository, Repository, Brackets } from 'typeorm';

import { EmergencyModel, PaginationRequest } from '@pawfect/models';
import {
  CustomerComingEntity,
  CustomerEmergencyContactEntity,
  CustomerEntity,
  CustomerHomeInfoEntity,
  PhotoEntity,
} from '@pawfect/db/entities';
import { HearAboutUsEnum } from '@pawfect/db/entities/enums';
import {
  SaveHomeInfoInterface,
  UpsertCustomerOptions,
  UpsertCustomerRelations,
} from './interfaces';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {
  private readonly customerEmergencyContactRepository: Repository<CustomerEmergencyContactEntity>;
  private readonly customerHomeInfoRepository: Repository<CustomerHomeInfoEntity>;
  private readonly customerComingRepository: Repository<CustomerComingEntity>;
  private readonly photoRepository: Repository<PhotoEntity>;

  constructor(readonly entityManager: EntityManager) {
    super();

    this.customerEmergencyContactRepository = entityManager.getRepository(
      CustomerEmergencyContactEntity,
    );
    this.customerHomeInfoRepository = entityManager.getRepository(
      CustomerHomeInfoEntity,
    );
    this.customerComingRepository = entityManager.getRepository(
      CustomerComingEntity,
    );
    this.photoRepository = entityManager.getRepository(PhotoEntity);
  }

  async upsertCustomer(
    upsertCustomerOptions: UpsertCustomerOptions,
    customerEntity?: CustomerEntity,
    relations: UpsertCustomerRelations = {},
  ): Promise<CustomerEntity> {
    customerEntity = customerEntity || new CustomerEntity();
    customerEntity.name = upsertCustomerOptions.name;
    customerEntity.surname = upsertCustomerOptions.surname;
    customerEntity.phoneNumber = upsertCustomerOptions.phoneNumber;
    customerEntity.workPhoneNumber = upsertCustomerOptions.workPhoneNumber;
    customerEntity.address = upsertCustomerOptions.homeAddress;
    customerEntity.billingAddress = upsertCustomerOptions.billingAddress;
    customerEntity.city = upsertCustomerOptions.city;
    customerEntity.state = upsertCustomerOptions.state;
    customerEntity.comment = upsertCustomerOptions.comment || null;
    customerEntity.status = upsertCustomerOptions.status
      ? upsertCustomerOptions.status
      : 0;
    customerEntity.isSameAddress = upsertCustomerOptions.isSameAddress;
    customerEntity.addressPosition = {
      type: 'Point',
      coordinates: [0, 0],
    };
    customerEntity.deviceToken = upsertCustomerOptions.deviceToken;
    customerEntity.deviceType = upsertCustomerOptions.deviceType;
    if (upsertCustomerOptions.homePosition) {
      customerEntity.addressPosition = {
        type: 'Point',
        // coordinates: [0, 0],
        coordinates: [
          upsertCustomerOptions.homePosition.lat,
          upsertCustomerOptions.homePosition.long,
        ],
      };
    }

    if (relations.zipCodeEntity) {
      customerEntity.zipCode = Promise.resolve(relations.zipCodeEntity);
    }

    if (relations.userEntity) {
      customerEntity.user = Promise.resolve(relations.userEntity);
    }

    await this.save(customerEntity);
    return customerEntity;
  }

  async clearEmergencies(customerEntity: CustomerEntity): Promise<void> {
    const emergencies = await customerEntity.emergencies;

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.remove<CustomerEmergencyContactEntity>(
        emergencies,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async addEmergencyBulk(
    customerEntity: CustomerEntity,
    emergencies: Array<EmergencyModel>,
  ): Promise<Array<CustomerEmergencyContactEntity>> {
    const resultEmergencies: Array<CustomerEmergencyContactEntity> = [];

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const emergencyModel of emergencies) {
        const newEmergency = new CustomerEmergencyContactEntity();
        newEmergency.name = emergencyModel.name;
        newEmergency.phoneNumber = emergencyModel.phoneNumber;
        newEmergency.customer = Promise.resolve(customerEntity);

        resultEmergencies.push(newEmergency);
      }

      await queryRunner.manager.save(resultEmergencies);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return resultEmergencies;
  }

  async updateEmergencyBulk(emergencies: Array<EmergencyModel>): Promise<void> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const emergencyModel of emergencies) {
        await queryRunner.manager.update(
          CustomerEmergencyContactEntity,
          { id: emergencyModel.id },
          {
            name: emergencyModel.name,
            phoneNumber: emergencyModel.phoneNumber,
          },
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getEmergencies(
    customerId: string,
  ): Promise<Array<CustomerEmergencyContactEntity>> {
    return await this.customerEmergencyContactRepository.find({
      where: { customer: customerId },
      order: {
        updatedAt: 'ASC',
      },
    });
  }

  async addEmergency(
    customerEntity: CustomerEntity,
    emergency: Omit<EmergencyModel, 'id'>,
  ): Promise<CustomerEmergencyContactEntity> {
    const newEmergency = new CustomerEmergencyContactEntity();
    newEmergency.name = emergency.name;
    newEmergency.phoneNumber = emergency.phoneNumber;
    newEmergency.customer = Promise.resolve(customerEntity);

    await this.customerEmergencyContactRepository.save(newEmergency);
    return newEmergency;
  }

  async deleteEmergency(
    customerEntity: CustomerEntity,
    emergencyId: string,
  ): Promise<void> {
    await this.customerEmergencyContactRepository
      .createQueryBuilder()
      .delete()
      .from(CustomerEmergencyContactEntity)
      .where('id = :id and customerId = :customerId', {
        id: emergencyId,
        customerId: customerEntity.id,
      })
      .execute();
  }

  async saveHomeInfo(
    customerEntity: CustomerEntity,
    homeInfo: SaveHomeInfoInterface,
  ): Promise<CustomerHomeInfoEntity> {
    const customerHomeInfoEntity =
      (await customerEntity.homeInfo) || new CustomerHomeInfoEntity();
    customerHomeInfoEntity.customer = Promise.resolve(customerEntity);

    customerHomeInfoEntity.lockboxCode = homeInfo.lockboxDoorCode || null;
    customerHomeInfoEntity.lockboxLocation = homeInfo.lockboxLocation || null;
    customerHomeInfoEntity.homeAlarmSystem = homeInfo.homeAlarmSystem || null;
    customerHomeInfoEntity.homeAccessNotes =
      homeInfo.otherHomeAccessNotes || null;
    customerHomeInfoEntity.mailbox = homeInfo.mailbox || null;
    customerHomeInfoEntity.otherRequest = homeInfo.otherRequestNotes || null;

    customerHomeInfoEntity.isMailKeyProvided = !!homeInfo.isMailKeyProvided;
    customerHomeInfoEntity.isSomeoneWillBeAtHome = !!homeInfo.isSomeoneWillBeAtHome;
    customerHomeInfoEntity.isTurnOnLight = !!homeInfo.isTurnLight;
    customerHomeInfoEntity.isWaterPlantExists = !!homeInfo.isWaterPlantsExists;

    customerHomeInfoEntity.trashPickUps = homeInfo.garbage;

    await this.customerHomeInfoRepository.save(customerHomeInfoEntity);

    return customerHomeInfoEntity;
  }

  async saveHearAboutUs(
    customerEntity: CustomerEntity,
    hearAboutUs: HearAboutUsEnum,
  ): Promise<CustomerComingEntity> {
    const customerComingEntity =
      (await customerEntity.coming) || new CustomerComingEntity();
    customerComingEntity.customer = Promise.resolve(customerEntity);
    customerComingEntity.hearAboutUs = hearAboutUs;

    await this.customerComingRepository.save(customerComingEntity);
    return customerComingEntity;
  }

  async setAvatar(
    customerEntity: CustomerEntity,
    avatarFileEntity: PhotoEntity,
    afterAction?: (photoEntity: PhotoEntity | undefined) => Promise<void>,
  ): Promise<void> {
    const oldPhoto: PhotoEntity | undefined = await customerEntity.avatar;

    await this.photoRepository.save(avatarFileEntity);

    customerEntity.avatar = Promise.resolve(avatarFileEntity);
    await this.save(customerEntity);

    if (afterAction) {
      await afterAction(oldPhoto);
    }
  }

  async getCustomerProfile(
    customerId: string,
  ): Promise<CustomerEntity | undefined> {
    const customer = await this.findOne({
      where: { id: customerId },
      relations: ['user', 'zipCode', 'homeInfo', 'avatar'],
    });

    return customer;
  }

  async getAll(
    paginationOptions: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<Pagination<CustomerEntity>> {
    const searchTerm = name.name;

    const query = this.createQueryBuilder('Customers')
      .leftJoinAndMapMany(
        'Customers.pets',
        'Pets',
        'Pets',
        'Customers.id = Pets.customerId',
      )
      .where('Customers.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('Pets.name ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          }).orWhere('Customers.name ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          });
        }),
      )
      .orderBy('Customers.createdAt', 'DESC');
    return paginate(query, paginationOptions);
  }
}
