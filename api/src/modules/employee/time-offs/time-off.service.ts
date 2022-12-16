import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmployeeEntity, EmployeeTimeOffEntity } from '@pawfect/db/entities';
import {
  EmployeeTimeOffRepository,
  OrderRepository,
} from '@pawfect/db/repositories';
import {
  AddTimeOffRequest,
  GetTimeOffsResponse,
  makeTimeOffViewModel,
  UpdateTimeOffRequest,
} from './models';
import {
  TimeOffDateTypeEnum,
  TimeOffStatusEnum,
} from '@pawfect/db/entities/enums';
import { DatesManager } from '@pawfect/services';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { Between } from 'typeorm';

@Injectable()
export class TimeOffService {
  constructor(
    private readonly employeeTimeOffRepository: EmployeeTimeOffRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  private timeOffsContainSameDates(
    timeOffs: Array<EmployeeTimeOffEntity>,
    dateManager: DatesManager,
    dateChoiceType: TimeOffDateTypeEnum,
  ): boolean {
    if (dateChoiceType === TimeOffDateTypeEnum.RANGE) {
      return true;
    }

    for (const timeOffEntity of timeOffs) {
      const containDate = this.timeOffContainSameDates(
        timeOffEntity,
        dateManager,
      );
      if (containDate) {
        return true;
      }
    }

    return false;
  }

  private timeOffContainSameDates(
    existTimeOff: EmployeeTimeOffEntity,
    dateManager: DatesManager,
  ): boolean {
    if (existTimeOff.dateType === TimeOffDateTypeEnum.RANGE) {
      return true;
    }

    return dateManager.containsDates(existTimeOff.dates);
  }

  async addTimeOffs(
    employeeEntity: EmployeeEntity,
    addTimeOffRequest: AddTimeOffRequest,
    dateManager: DatesManager,
  ): Promise<SuccessModel> {
    const pendingEmployeeTimeOff = await this.employeeTimeOffRepository.findOne(
      {
        where: {
          employee: employeeEntity,
          status: TimeOffStatusEnum.WAITING,
        },
      },
    );
    if (pendingEmployeeTimeOff) {
      throw new BadRequestException(
        'You can not have more than one time-off in the waiting status',
      );
    }
    //Order assign on that date
    for (let i = 0; i < addTimeOffRequest.dates.length; i++) {
      const orderAssign = await this.orderRepository.find({
        where: [
          {
            employee: employeeEntity.id,
            isEmployeeAccepted: true,
          },
        ],
      });

      for (let j = 0; j < orderAssign.length; j++) {
        if (
          orderAssign[j].dateFrom.toLocaleDateString() ===
          new Date(addTimeOffRequest.dates[i]).toLocaleDateString()
        ) {
          throw new BadRequestException(
            'The specified dates already contains a Order',
          );
        }
      }
    }

    const timeOffsInDateRangeEntities = await this.employeeTimeOffRepository.timeOffsInDateRange(
      employeeEntity.id,
      TimeOffStatusEnum.APPROVED,
      dateManager.minDate(),
      dateManager.maxDate(),
    );

    if (timeOffsInDateRangeEntities.length) {
      const timeOffsContainSameDates = this.timeOffsContainSameDates(
        timeOffsInDateRangeEntities,
        dateManager,
        addTimeOffRequest.dateChoiceType,
      );
      if (timeOffsContainSameDates) {
        throw new BadRequestException(
          'The specified dates already contains a approved time-off',
        );
      }
    }

    await this.employeeTimeOffRepository.addTimeOffAsEmployee(
      {
        ...addTimeOffRequest,
        dates: dateManager.toJSDates(),
      },
      employeeEntity,
    );

    return new SuccessModel();
  }

  async getTimeOffs(
    employeeEntity: EmployeeEntity,
    paginationRequest: PaginationRequest,
  ): Promise<GetTimeOffsResponse> {
    const paginateTimeOffs = await this.employeeTimeOffRepository.getEmployeeTimeOffsAsEmployee(
      employeeEntity,
      paginationRequest,
    );

    // console.log('items==>', paginateTimeOffs.items);
    const items = paginateTimeOffs.items.map((timeOff) => {
      const datesInMs = timeOff.dates.map((date) => +date);

      return makeTimeOffViewModel(timeOff, datesInMs);
    });

    return {
      items: items,
      meta: paginateTimeOffs.meta,
    };
  }

  async editTimeOff(
    employeeEntity: EmployeeEntity,
    timeOffId: string,
    updateTimeOffRequest: UpdateTimeOffRequest,
    dateManager: DatesManager,
  ): Promise<SuccessModel> {
    const timeOff = await this.employeeTimeOffRepository.findOne({
      where: {
        id: timeOffId,
        employee: employeeEntity.id,
      },
    });

    if (!timeOff) {
      throw new NotFoundException('Time-off not found', timeOffId);
    }
    if (timeOff.status !== TimeOffStatusEnum.WAITING) {
      throw new BadRequestException(
        'Time-off can be update only in waiting status',
      );
    }
    const timeOffsInDateRangeEntities = await this.employeeTimeOffRepository.timeOffsInDateRange(
      employeeEntity.id,
      TimeOffStatusEnum.APPROVED,
      dateManager.minDate(),
      dateManager.maxDate(),
    );

    if (timeOffsInDateRangeEntities.length) {
      const timeOffsContainSameDates = this.timeOffsContainSameDates(
        timeOffsInDateRangeEntities,
        dateManager,
        updateTimeOffRequest.dateChoiceType,
      );
      if (timeOffsContainSameDates) {
        throw new BadRequestException(
          'The specified dates already contains a approved time-off',
        );
      }
    }

    await this.employeeTimeOffRepository.editTimeOffAsEmployee(timeOff, {
      ...updateTimeOffRequest,
      dates: dateManager.toJSDates(),
    });

    return new SuccessModel();
  }
}
