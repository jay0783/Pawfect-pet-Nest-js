import { DateTime } from "luxon";


export interface SetDaysOptions {
  dateFrom: DateTime;
  dateTo: DateTime;
  amount: number;
  isHoliday: boolean;
}
