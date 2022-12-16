import { DateTime } from "luxon";


export interface VisitModel {
  dateFrom: DateTime;
  dateTo: DateTime;
  amount: number;
  isHoliday: boolean;
}
