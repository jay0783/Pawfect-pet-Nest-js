import { EmployeeStatusEnum } from "@pawfect/db/entities/enums";


export interface GetMonthScheduleResponse {
  [key: number]: EmployeeStatusEnum;
}
