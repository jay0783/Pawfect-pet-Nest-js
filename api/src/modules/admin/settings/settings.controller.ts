import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TimeBlocksEntity } from '@pawfect/db/entities';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  AddTimeBLockRequest,
  BookingRestrictionsRequest,
  bookingRestrictionViewModel,
  TimeBlocksListResponse,
} from './models';
import { SettingsService } from './settings.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('admin-jwt'))
@ApiTags('Settings')
@Controller('admin/settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('booking-restrictions')
  async getBookingRestrictions(): Promise<bookingRestrictionViewModel> {
    const bookingRestrictionsResponse: bookingRestrictionViewModel = await this.settingsService.getBookingRestricitons();
    return bookingRestrictionsResponse;
  }

  @Put('booking-restrictions')
  async editBookingRestriction(
    @Body() updateBookingRestrictionsRequest: BookingRestrictionsRequest,
  ): Promise<SuccessModel> {
    const updateRestrictions: SuccessModel = await this.settingsService.updateBookingRestrictions(
      updateBookingRestrictionsRequest,
    );
    return new SuccessModel();
  }

  @Get('time-blocks')
  async getTimeBlocks(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<PaginationResponse<TimeBlocksListResponse>> {
    const timeBlocks = await this.settingsService.getTimeBlocks(
      paginationRequest,
    );
    return timeBlocks;
  }

  @Post('time-blocks')
  async addTimeBlock(
    @Body() addTimeBlockRequest: AddTimeBLockRequest,
  ): Promise<SuccessModel> {
    const add = await this.settingsService.addTimeBlock(addTimeBlockRequest);
    return new SuccessModel();
  }

  @Delete('time-blocks/:timeBlockId')
  async deleteTimeBlock(
    @Param('timeBlockId', new ParseUUIDPipe()) timeBlockId: string,
  ): Promise<SuccessModel> {
    const delteTimeBlock = await this.settingsService.deleteTimeBLock(
      timeBlockId,
    );
    return new SuccessModel();
  }
}
