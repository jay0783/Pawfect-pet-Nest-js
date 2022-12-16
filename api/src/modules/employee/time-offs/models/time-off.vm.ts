import { TimeOffDateTypeEnum, TimeOffEnum, TimeOffStatusEnum } from "@pawfect/db/entities/enums";
import { EmployeeTimeOffEntity } from "@pawfect/db/entities";


export interface TimeOffViewModel {
  id: string;
  dateChoiceType: TimeOffDateTypeEnum;
  timeOffType: TimeOffEnum;
  dates: Array<number>;
  notes?: string | null;
  status: TimeOffStatusEnum;
}

export function makeTimeOffViewModel(entity: EmployeeTimeOffEntity, datesInMs: Array<number>): TimeOffViewModel {
  return {
    id: entity.id,
    dateChoiceType: entity.dateType,
    timeOffType: entity.type,
    dates: datesInMs,
    notes: entity.notes,
    status: entity.status
  };
}
