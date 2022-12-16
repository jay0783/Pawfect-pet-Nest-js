import { Injectable } from "@nestjs/common";

import { HolidayRepository } from "@pawfect/db/repositories";
import { SuccessModel } from "@pawfect/models";
import { AddHolidayRequest, GetHolidayResponse } from "./models";


@Injectable()
export class HolidayService {
  constructor(
    private readonly holidayRepository: HolidayRepository
  ) { }


  async toggleHoliday(addHolidayRequest: AddHolidayRequest): Promise<SuccessModel> {
    await this.holidayRepository.toggleHoliday(addHolidayRequest.day, addHolidayRequest.month);
    return new SuccessModel();
  }


  async getHolidays(): Promise<GetHolidayResponse> {
    const holidayEntities = await this.holidayRepository.find();
    const response: GetHolidayResponse = { items: holidayEntities.map((item) => ({ day: item.day, month: item.month })) };
    return response;
  }
}
