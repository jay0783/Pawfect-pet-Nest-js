import {
  Controller, Get, Query, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { HolidayService } from "./holiday.service";
import { GetHolidaysByDateRangeRequest, GetHolidaysByDateRangeResponse } from "./models";


@UseGuards(AuthGuard("customer-jwt"))
@Controller("customer/holidays")
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService
  ) { }


  @Get("range")
  async getHolidaysByDateRange(@Query() getHolidaysByDateRangeRequest: GetHolidaysByDateRangeRequest): Promise<GetHolidaysByDateRangeResponse> {
    const response = await this.holidayService.getHolidaysByDateRange(getHolidaysByDateRangeRequest);
    return response;
  }


  @Get("fee")
  async getCancellationFee(): Promise<{ feeAmount: number; }> {
    const response = await this.holidayService.getCancellationFee();
    return response;
  }
}
