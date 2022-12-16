import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { bookingRestrictionViewModel, TimeBlocksListResponse } from './models';
import { SettingsService } from './settings.service';

@UseGuards(AuthGuard('customer-jwt'))
@Controller('customer/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('booking-restrictions')
  async getBookingRestrictions(): Promise<bookingRestrictionViewModel> {
    const bookingRestrictionsResponse: bookingRestrictionViewModel = await this.settingsService.getBookingRestricitons();
    return bookingRestrictionsResponse;
  }

  @Get('time-blocks')
  async getTimeBlocks(): Promise<Array<TimeBlocksListResponse>> {
    const timeBlocks: Array<TimeBlocksListResponse> = await this.settingsService.getTimeBlocks();
    return timeBlocks;
  }
}
