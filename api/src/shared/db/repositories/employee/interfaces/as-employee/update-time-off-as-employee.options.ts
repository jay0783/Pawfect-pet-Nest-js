import { TimeOffDateTypeEnum, TimeOffEnum } from "@pawfect/db/entities/employee/enums";


export interface UpdateTimeOffAsEmployeeOptions {
  dateChoiceType: TimeOffDateTypeEnum;
  timeOffType: TimeOffEnum;
  notes?: string;
  dates: Array<Date>;
}
