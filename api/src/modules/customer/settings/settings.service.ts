import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BookingRestrictionsEntity,
  TimeBlocksEntity,
} from '@pawfect/db/entities';
import {
  TimeBlocksRepository,
  BookingRestrictionsRepository,
} from '@pawfect/db/repositories';
import { PaginationResponse, SuccessModel } from '@pawfect/models';
import { DateTime } from 'luxon';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  AddTimeBLockRequest,
  bookingRestrictionRequestModel,
  BookingRestrictionsRequest,
  bookingRestrictionViewModel,
  makeBookingRestrictionsViewModelMany,
  TimeBlocksListResponse,
} from './models';

@Injectable()
export class SettingsService {
  constructor(
    private timeBlocksRepository: TimeBlocksRepository,
    private bookingRestrictionsRepository: BookingRestrictionsRepository,
  ) {}

  async getBookingRestricitons(): Promise<bookingRestrictionViewModel> {
    const bookingRestrictions: Array<BookingRestrictionsEntity> = await this.bookingRestrictionsRepository.find();
    const response: bookingRestrictionViewModel = makeBookingRestrictionsViewModelMany(
      bookingRestrictions,
    );
    return response;
  }

  async getTimeBlocks(): Promise<Array<TimeBlocksListResponse>> {
    //returns all the timeBlocks entity with pagination input
    const paginatedResponse: Array<TimeBlocksEntity> = await this.timeBlocksRepository.find();
    //curating a custome response
    const response: Array<TimeBlocksListResponse> = paginatedResponse.map(
      (item) => {
        return {
          id: item.id,
          title: item.title,
          timeFrom: item.timeFrom.getTime(),
          timeTo: item.timeTo.getTime(),
          status: item.status,
        };
      },
    );

    return response;
  }
}
