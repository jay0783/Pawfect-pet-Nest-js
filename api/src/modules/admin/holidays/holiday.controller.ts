import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SuccessModel } from '@pawfect/models';
import { HolidayService } from './holiday.service';
import {
  AddHolidayRequest,
  AddMultipleHolidayRequest,
  GetHolidayResponse,
} from './models';

@ApiBearerAuth()
@ApiTags('Holiday')
@Controller('admin/holidays')
@UseGuards(AuthGuard('admin-jwt'))
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async getHolidays(): Promise<GetHolidayResponse> {
    const response = await this.holidayService.getHolidays();
    return response;
  }

  // @Post('toggle')
  // async toggleHoliday(
  //   @Body() addHolidayRequest: AddHolidayRequest,
  // ): Promise<SuccessModel> {
  //   const response = await this.holidayService.toggleHoliday(addHolidayRequest);
  //   return response;
  // }

  @Post('toggle')
  async toggleMultipleHolidays(
    @Body() addMultipleHolidayRequest: AddMultipleHolidayRequest,
  ): Promise<SuccessModel> {
    for (const addHolidayRequest of addMultipleHolidayRequest.days) {
      await this.holidayService.toggleHoliday(addHolidayRequest);
    }
    return new SuccessModel();
  }
}
