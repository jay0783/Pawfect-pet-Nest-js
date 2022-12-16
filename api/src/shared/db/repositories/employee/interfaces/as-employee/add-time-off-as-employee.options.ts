import { TimeOffDateTypeEnum, TimeOffEnum } from '@pawfect/db/entities/enums';

export interface AddTimeOffAsEmployeeOptions {
  dateChoiceType: TimeOffDateTypeEnum;
  timeOffType: TimeOffEnum;
  notes?: string;
  dates: Array<Date>;
}
