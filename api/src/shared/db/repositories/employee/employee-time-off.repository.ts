import { Brackets, EntityRepository, Repository } from 'typeorm';

import { EmployeeEntity, EmployeeTimeOffEntity } from '@pawfect/db/entities';
import { TimeOffStatusEnum } from '@pawfect/db/entities/enums';
import {
  AddTimeOffAsEmployeeOptions,
  UpdateTimeOffAsEmployeeOptions,
} from './interfaces';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { DateTime } from 'luxon';

@EntityRepository(EmployeeTimeOffEntity)
export class EmployeeTimeOffRepository extends Repository<EmployeeTimeOffEntity> {
  async getEmployeeTimeOffsAsEmployee(
    employeeEntity: EmployeeEntity,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<EmployeeTimeOffEntity>> {
    const paginateTimeOffs = await paginate(this, paginationOptions, {
      where: { employee: employeeEntity },
      order: { createdAt: 'DESC' },
    });

    return paginateTimeOffs;
  }

  async addTimeOffAsEmployee(
    upsertTimeOffOptions: AddTimeOffAsEmployeeOptions,
    employeeEntity: EmployeeEntity,
  ): Promise<EmployeeTimeOffEntity> {
    const newTimeOff = new EmployeeTimeOffEntity();
    newTimeOff.dateType = upsertTimeOffOptions.dateChoiceType;
    newTimeOff.type = upsertTimeOffOptions.timeOffType;
    newTimeOff.notes = upsertTimeOffOptions.notes;
    newTimeOff.dates = upsertTimeOffOptions.dates;
    newTimeOff.employee = Promise.resolve(employeeEntity);
    newTimeOff.status = TimeOffStatusEnum.WAITING;
    newTimeOff.updateStartAndEndDates();

    await this.save(newTimeOff);

    return newTimeOff;
  }

  async editTimeOffAsEmployee(
    timeOffEntity: EmployeeTimeOffEntity,
    updateTimeOffOptions: UpdateTimeOffAsEmployeeOptions,
  ): Promise<EmployeeTimeOffEntity> {
    timeOffEntity.dateType = updateTimeOffOptions.dateChoiceType;
    timeOffEntity.type = updateTimeOffOptions.timeOffType;
    timeOffEntity.notes = updateTimeOffOptions.notes;
    timeOffEntity.dates = updateTimeOffOptions.dates;
    timeOffEntity.updateStartAndEndDates();

    await this.save(timeOffEntity);

    return timeOffEntity;
  }

  async timeOffsInDateRange(
    employeeId: string,
    status: TimeOffStatusEnum,
    dateFrom: DateTime,
    dateTo: DateTime,
  ): Promise<Array<EmployeeTimeOffEntity>> {
    const dateFromDate = dateFrom.toJSDate();
    const dateToDate = dateTo.toJSDate();

    const timeOffsEntities = await this.createQueryBuilder('TimeOffs')
      .where(
        '(TimeOffs.employeeId = :employeeId AND TimeOffs.status = :status)',
        {
          employeeId,
          status,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(TimeOffs.dateFrom >= :dateFrom::timestamp AND TimeOffs.dateFrom <= :dateTo::timestamp)',
            { dateFrom: dateFromDate, dateTo: dateToDate },
          )
            .orWhere(
              '(TimeOffs.dateTo >= :dateFrom::timestamp AND TimeOffs.dateTo <= :dateTo::timestamp)',
              { dateFrom: dateFromDate, dateTo: dateToDate },
            )
            .orWhere(
              '(TimeOffs.dateFrom <= :dateFrom::timestamp AND TimeOffs.dateTo >= :dateTo::timestamp)',
              { dateFrom: dateFromDate, dateTo: dateToDate },
            );
        }),
      )
      .getMany();

    return timeOffsEntities;
  }

  async getAllTimeOffsAsAdmin(
    status: TimeOffStatusEnum,
    paginationOpt: IPaginationOptions,
  ): Promise<Pagination<EmployeeTimeOffEntity>> {
    const timeOffsQuery = this.createQueryBuilder('TimeOffs')
      .where('TimeOffs.status = :status', { status })
      .leftJoinAndMapOne(
        'TimeOffs.employee',
        'Employees',
        'Employees',
        'TimeOffs.employeeId = Employees.id',
      )
      .leftJoinAndMapOne(
        'Employee.avatar',
        'Photos',
        'Photos',
        'Employees.avatarId = Photos.id',
      )
      .orderBy({
        'TimeOffs.updatedAt': 'DESC',
      });

    const paginateTimeOffs = await paginate(timeOffsQuery, paginationOpt);
    return paginateTimeOffs;
  }

  async findByRange(
    employeeId: string,
    startDate: DateTime,
    endDate: DateTime,
  ): Promise<Array<EmployeeTimeOffEntity>> {
    const query = this.createQueryBuilder('TimeOffs')
      .where('TimeOffs.employeeId = :employeeId', { employeeId })
      .andWhere('TimeOffs.status = :status', {
        status: TimeOffStatusEnum.APPROVED,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(TimeOffs.dateFrom >= :dateFrom::timestamp AND TimeOffs.dateFrom <= :dateTo::timestamp)',
            { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
          )
            .orWhere(
              '(TimeOffs.dateTo >= :dateFrom::timestamp AND TimeOffs.dateTo <= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            )
            .orWhere(
              '(TimeOffs.dateFrom <= :dateFrom::timestamp AND TimeOffs.dateTo >= :dateTo::timestamp)',
              { dateFrom: startDate.toJSDate(), dateTo: endDate.toJSDate() },
            );
        }),
      );

    const employeeTimeOffs = await query.getMany();
    return employeeTimeOffs;
  }
}
