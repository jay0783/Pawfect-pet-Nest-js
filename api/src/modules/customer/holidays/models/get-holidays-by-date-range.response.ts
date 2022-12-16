import { PaginationResponse } from "@pawfect/models";


export interface GetHolidaysByDateRangeResponse extends PaginationResponse<HolidayModel> { }

export interface HolidayModel {
  day: number;
  month: number;
  feeAmount: number;
}
