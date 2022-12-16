import {
  EmployeeEntity,
  EmployeeTimeOffEntity,
  PhotoEntity,
} from '@pawfect/db/entities';

export interface TimeOffShortViewModel {
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
  startedDate: number;
  endedDate: number;
  type: string;
  dateType: string;
}

export async function makeTimeOffShortViewModel(
  timeOffEntity: EmployeeTimeOffEntity,
): Promise<TimeOffShortViewModel> {
  const employeeEntity: EmployeeEntity = await timeOffEntity.employee;
  const employeePhoto: PhotoEntity | undefined = await employeeEntity.avatar;
  const startedDateInMs = +timeOffEntity.dateFrom;
  const endedDateInMs = +timeOffEntity.dateTo;

  return {
    id: timeOffEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: employeePhoto?.url || null,
    startedDate: startedDateInMs,
    endedDate: endedDateInMs,
    type: timeOffEntity.type,
    dateType: timeOffEntity.dateType,
  };
}

export async function makeTimeOffShortViewModelMany(
  timeOffEntities: EmployeeTimeOffEntity[],
): Promise<Promise<TimeOffShortViewModel>[]> {
  return timeOffEntities.map((entity) => makeTimeOffShortViewModel(entity));
}
