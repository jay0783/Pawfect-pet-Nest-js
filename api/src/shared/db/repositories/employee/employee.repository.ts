import { DateTime } from 'luxon';
import { Brackets, EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { EmergencyModel, PaginationRequest } from '@pawfect/models';
import {
  EmployeeEmergencyContactEntity,
  EmployeeEntity,
  EmployeeRatingEntity,
  EmployeeTimeOffEntity,
  PhotoEntity,
} from '@pawfect/db/entities';
import {
  TimeOffDateTypeEnum,
  TimeOffStatusEnum,
} from '@pawfect/db/entities/enums';
import {
  EmployeeStatsModel,
  UpsertEmployeeOptions,
  UpsertEmployeeRelations,
} from './interfaces';
import { EmployeeRatingRepository } from './employee-rating.repository';

@EntityRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity> {
  private readonly photoRepository: Repository<PhotoEntity>;

  private readonly employeeEmergencyContactRepository: Repository<EmployeeEmergencyContactEntity>;

  private readonly employeeTimeOffRepository: Repository<EmployeeTimeOffEntity>;
  private readonly employeeRatingRepository: EmployeeRatingRepository;

  constructor(entityManager: EntityManager) {
    super();
    this.photoRepository = entityManager.getRepository(PhotoEntity);
    this.employeeEmergencyContactRepository = entityManager.getRepository(
      EmployeeEmergencyContactEntity,
    );
    this.employeeTimeOffRepository = entityManager.getRepository(
      EmployeeTimeOffEntity,
    );
    this.employeeRatingRepository = entityManager.getCustomRepository(
      EmployeeRatingRepository,
    );
  }

  async getAllForTable(
    paginationOptions: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<Pagination<EmployeeEntity>> {
    const searchTerm = name.name;

    const query = this.createQueryBuilder('Employees')
      .leftJoinAndMapOne(
        'Employees.avatar',
        'Photos',
        'EmployeePhotos',
        'Employees.avatarId = EmployeePhotos.id',
      )
      .where('Employees.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    return paginate(query, paginationOptions);
  }

  async getTimeOffByDay(
    employeeId: string,
    day: DateTime,
  ): Promise<EmployeeTimeOffEntity | undefined> {
    const locDay = day.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const todaysDate = new Date().toLocaleString().split(',')[0];

    const timeOffEntity:
      | EmployeeTimeOffEntity
      | undefined = await this.employeeTimeOffRepository
      .createQueryBuilder('EmployeeTimeOffs')
      .where('EmployeeTimeOffs.employeeId = :employeeId', { employeeId })
      .andWhere('EmployeeTimeOffs.dateFrom <= :day', { day: locDay })
      .andWhere('EmployeeTimeOffs.dateTo >= :day', { day: locDay })
      .andWhere('EmployeeTimeOffs.status = :status', {
        status: TimeOffStatusEnum.APPROVED,
      })
      .andWhere(
        '(EmployeeTimeOffs.dateType = :dateTypeSeparated OR EmployeeTimeOffs.dateType = :dateTypeRange)',
        {
          dateTypeSeparated: TimeOffDateTypeEnum.SEPARATED,
          dateTypeRange: TimeOffDateTypeEnum.RANGE,
        },
      )
      .getOne();

    if (timeOffEntity?.dateType === TimeOffDateTypeEnum.RANGE) {
      if (
        timeOffEntity?.dates.some((date) => {
          // DateTime.fromJSDate(date).equals(locDay),
          return date.toLocaleString().split(',')[0] === todaysDate;
        })
      ) {
        // console.log('condition_true');
        return timeOffEntity;
      }
      return undefined;
    }
    return timeOffEntity;
  }

  async upsertEmployee(
    upsertEmployeeOptions: UpsertEmployeeOptions,
    employeeEntity?: EmployeeEntity,
    relations: UpsertEmployeeRelations = {},
  ): Promise<EmployeeEntity> {
    const newEmployeeEntity: EmployeeEntity =
      employeeEntity || new EmployeeEntity();
    newEmployeeEntity.name = upsertEmployeeOptions.name;
    newEmployeeEntity.surname = upsertEmployeeOptions.surname;
    newEmployeeEntity.phoneNumber = upsertEmployeeOptions.phoneNumber;
    newEmployeeEntity.address = upsertEmployeeOptions.homeAddress;
    newEmployeeEntity.workTimeFrom = upsertEmployeeOptions.workTimeFrom;
    newEmployeeEntity.workTimeTo = upsertEmployeeOptions.workTimeTo;
    newEmployeeEntity.jobRate = upsertEmployeeOptions.jobRate;

    if (relations.userEntity) {
      newEmployeeEntity.user = Promise.resolve(relations.userEntity);
    }

    if (relations.zipCodeEntity) {
      newEmployeeEntity.zipCode = Promise.resolve(relations.zipCodeEntity);
    }

    await this.save(newEmployeeEntity);

    return newEmployeeEntity;
  }

  async addEmergencyBulk(
    employeeEntity: EmployeeEntity,
    emergencies: Array<EmergencyModel>,
  ): Promise<Array<EmployeeEmergencyContactEntity>> {
    const resultEmergencies: Array<EmployeeEmergencyContactEntity> = new Array<EmployeeEmergencyContactEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const emergencyModel of emergencies) {
        const newEmergency = new EmployeeEmergencyContactEntity();
        newEmergency.name = emergencyModel.name;
        newEmergency.phoneNumber = emergencyModel.phoneNumber;
        newEmergency.employee = Promise.resolve(employeeEntity);

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

  async clearEmergencies(employeeEntity: EmployeeEntity): Promise<void> {
    const emergencies = await employeeEntity.emergencies;

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.remove<EmployeeEmergencyContactEntity>(
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

  async updateEmergencyBulk(emergencies: Array<EmergencyModel>): Promise<void> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const emergencyModel of emergencies) {
        await queryRunner.manager.update(
          EmployeeEmergencyContactEntity,
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

  async addEmergency(
    employeeEntity: EmployeeEntity,
    emergency: EmergencyModel,
  ): Promise<EmployeeEmergencyContactEntity> {
    const newEmergency = new EmployeeEmergencyContactEntity();
    newEmergency.name = emergency.name;
    newEmergency.phoneNumber = emergency.phoneNumber;
    newEmergency.employee = Promise.resolve(employeeEntity);

    await this.employeeEmergencyContactRepository.save(newEmergency);
    return newEmergency;
  }

  async setAvatar(
    employeeEntity: EmployeeEntity,
    avatarFileEntity: PhotoEntity,
    afterAction?: (photoEntity: PhotoEntity | undefined) => Promise<void>,
  ): Promise<void> {
    const oldPhoto: PhotoEntity | undefined = await employeeEntity.avatar;

    await this.photoRepository.save(avatarFileEntity);

    employeeEntity.avatar = Promise.resolve(avatarFileEntity);
    await this.save(employeeEntity);

    if (afterAction) {
      await afterAction(oldPhoto);
    }
  }

  async wasOrderRated(customerId: string, orderId: string): Promise<boolean> {
    const foundEmployeeRating:
      | EmployeeRatingEntity
      | undefined = await this.employeeRatingRepository
      .createQueryBuilder('EmployeeRatings')
      .where('EmployeeRatings.customerId = :customerId', { customerId })
      .andWhere('EmployeeRatings.orderId = :orderId', { orderId })
      .getOne();

    return !!foundEmployeeRating;
  }

  async getStatsByDate(date: DateTime): Promise<EmployeeStatsModel> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const locDay = date.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const [raw] = await this.query(
      `SELECT * FROM crosstab(
        ' SELECT
            ' || QUOTE_LITERAL('temp-id') || ' as "id",
            CASE WHEN (NOT "EmployeeTimeOffs"."type" IS NULL) THEN (
              "EmployeeTimeOffs"."type"::text
            ) ELSE ' ||   QUOTE_LITERAL('available') || ' END AS "type",
            count("EmployeeTimeOffs" IS NULL) as "value"
          FROM
            "Employees"
            LEFT JOIN "EmployeeTimeOffs" ON "Employees"."id" = "EmployeeTimeOffs"."employeeId" AND ' || QUOTE_LITERAL($1) || '::Date =  ANY("EmployeeTimeOffs"."dates") AND  "EmployeeTimeOffs"."status" = ' ||   QUOTE_LITERAL('approved') || '
    GROUP BY
            "EmployeeTimeOffs"."status",
            "EmployeeTimeOffs"."type"
          ORDER BY
            "EmployeeTimeOffs"."status"
        ',
          ' VALUES
            (' || QUOTE_LITERAL('available') || '),
	          (' || QUOTE_LITERAL('sick') || '),
	          (' || QUOTE_LITERAL('business-trip') || '),
            (' || QUOTE_LITERAL('other') || ')
          '
      ) AS ct (
        "temp-id" text, "available" bigint, "sick" bigint,
        "business-trip" bigint, "other" bigint
      );`,
      [locDay.toFormat('yyyy-MM-dd')],
    );

    // console.log('raw_response====>', raw);
    // console.log('date====>', locDay.toFormat('yyyy-MM-dd'));

    return {
      available: +raw['available'],
      vacation: +raw['business-trip'],
      sick: +raw['sick'],
      unavailable: +raw['other'],
    };

    console.log('other==>', raw);
  }

  async getTopRated(): Promise<Array<EmployeeEntity>> {
    const query = this.createQueryBuilder('Employees')
      .leftJoin(
        (qb) =>
          qb
            .select('EmployeeRatings.employeeId')
            .addSelect(
              'count("EmployeeRatings"."employeeId")',
              'employeeCountRating',
            )
            .from('EmployeeRatings', 'EmployeeRatings')
            .groupBy('EmployeeRatings.employeeId'),
        'EmployeeCountRatings',
        'Employees.id = "EmployeeCountRatings"."employeeId"',
      )
      .orderBy('Employees.rating', 'DESC')
      .addOrderBy('"EmployeeCountRatings"."employeeCountRating"', 'DESC');

    const employees = query.getMany();

    return employees;
  }

  async findAvailable(
    dateFrom: Date,
    dateTo: Date,
    paginationOpt: IPaginationOptions,
  ): Promise<Pagination<EmployeeEntity>> {
    const query = this.createQueryBuilder('Employees')
      .leftJoin(
        'Orders',
        'Orders',
        '"Employees"."id" = "Orders"."employeeId" AND ("Orders"."dateFrom"::timestamp <= :dateTo::timestamp AND "Orders"."dateTo"::timestamp >= :dateFrom::timestamp)',
        { dateFrom: dateFrom, dateTo: dateTo },
      )
      .where('Orders.id IS NULL')
      .orWhere('Orders.isEmployeeAccepted = FALSE');

    const paginateEmployees = await paginate(query, paginationOpt);

    return paginateEmployees;
  }

  async getAllPayroll(
    paginationOptions: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<Pagination<EmployeeEntity>> {
    const searchTerm = name.name;

    const query = this.createQueryBuilder('Employees')
      .where('Employees.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('Employees.createdAt', 'DESC');
    return paginate(query, paginationOptions);
  }
}
