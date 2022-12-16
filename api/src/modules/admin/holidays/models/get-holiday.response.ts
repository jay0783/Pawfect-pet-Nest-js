import { PaginationResponse } from "../../../../shared/models";

export interface GetHolidayResponse extends PaginationResponse<HolidayModel> {

}

export interface HolidayModel {
  day: number;
  month: number;
}
