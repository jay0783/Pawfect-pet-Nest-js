import {
  EmployeeEntity,
  EmployeeTimeOffEntity,
  PhotoEntity,
} from '@pawfect/db/entities';
import { TimeOffDateTypeEnum, TimeOffEnum } from '@pawfect/db/entities/enums';
interface RangeTimeOffDetails {
  startedDate?: number;
  endedDate?: number;
}
interface SeparatedTimeOffDetails {
  dates?: Number[];
}

export interface TimeOffDetailsViewModel
  extends SeparatedTimeOffDetails,
    RangeTimeOffDetails {
  id: string;
  type: TimeOffEnum;
  dateType: TimeOffDateTypeEnum;
  comment: string | null;
  employee: {
    id: string;
    name: string;
    surname: string;
    imageUrl: string | null;
  };
}

export async function makeTimeOffDetailsViewModel(
  timeOffEntity: EmployeeTimeOffEntity,
): Promise<TimeOffDetailsViewModel> {
  const employeeEntity: EmployeeEntity = await timeOffEntity.employee;
  const employeePhoto: PhotoEntity | undefined = await employeeEntity.avatar;
  const startedDateInMs = +timeOffEntity.dateFrom;
  const endedDateInMs = +timeOffEntity.dateTo;
  const dates = timeOffEntity.dates.map((date) => {
    return +date;
  });

  const mainResponse: TimeOffDetailsViewModel = {
    id: timeOffEntity.id,
    type: timeOffEntity.type,
    dateType: timeOffEntity.dateType,
    comment: timeOffEntity.notes || null,
    employee: {
      id: employeeEntity.id,
      name: employeeEntity.name,
      surname: employeeEntity.surname,
      imageUrl: employeePhoto?.url || null,
    },
  };

  let timeOffinfo: SeparatedTimeOffDetails | RangeTimeOffDetails = {};
  if (timeOffEntity.dateType == TimeOffDateTypeEnum.RANGE) {
    timeOffinfo = {
      startedDate: startedDateInMs,
      endedDate: endedDateInMs,
    };
  }
  if (timeOffEntity.dateType == TimeOffDateTypeEnum.SEPARATED) {
    timeOffinfo = {
      dates: dates,
    };
  }

  const timeOffResponse: TimeOffDetailsViewModel = Object.assign(
    mainResponse,
    timeOffinfo,
  );
  return timeOffResponse;
}
