import { Injectable } from "@nestjs/common";
import { FeeRepository, HolidayRepository } from "@pawfect/db/repositories";
import { DateTime } from "luxon";
import { FeeEnum } from "@pawfect/db/entities/enums";
import { GetHolidaysByDateRangeRequest, GetHolidaysByDateRangeResponse } from "./models";


@Injectable()
export class HolidayService {
  constructor(
    private readonly feeRepository: FeeRepository,
    private readonly holidayRepository: HolidayRepository
  ) { }


  async getHolidaysByDateRange(getHolidaysByDateRangeRequest: GetHolidaysByDateRangeRequest): Promise<GetHolidaysByDateRangeResponse> {
    const dateFrom: DateTime = DateTime.fromMillis(getHolidaysByDateRangeRequest.dateFrom);
    const dateTo: DateTime = DateTime.fromMillis(getHolidaysByDateRangeRequest.dateTo);

    const holidayFee = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    const holidayEntities = await this.holidayRepository.findByRange(dateFrom, dateTo);
    const holidayViewModels = holidayEntities.map((item) => ({ day: item.day, month: item.month, feeAmount: holidayFee }));

    return { items: holidayViewModels };
  }


  async getCancellationFee(): Promise<{ feeAmount: number; }> {
    const feeAmount = await this.feeRepository.getFeeAmount(FeeEnum.HOLIDAY);
    return { feeAmount: feeAmount };
  }
}
