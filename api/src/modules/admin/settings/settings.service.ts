import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async updateBookingRestrictions(
    bookingRestrictionsRequest: BookingRestrictionsRequest,
  ): Promise<SuccessModel> {
    //Iterating each Entity received in request
    for (const bookingRestrictionRequest of bookingRestrictionsRequest.restrictions) {
      const bookingRestrictionEntity:
        | BookingRestrictionsEntity
        | undefined = await this.bookingRestrictionsRepository.findOne(
        //finding respective entity with given id
        bookingRestrictionRequest.id,
      );
      if (!bookingRestrictionEntity) {
        throw new NotFoundException(
          'Booking restriction not found with provided id',
        );
      }
      //updating existing entity with new data received in request
      bookingRestrictionEntity.months = bookingRestrictionRequest.months;
      bookingRestrictionEntity.days = bookingRestrictionRequest.days;
      bookingRestrictionEntity.hours = bookingRestrictionRequest.hours;
      bookingRestrictionEntity.minutes = bookingRestrictionRequest.minutes;
      await this.bookingRestrictionsRepository.save(bookingRestrictionEntity);
    }
    return new SuccessModel();
  }

  async getTimeBlocks(
    paginationRequest: IPaginationOptions,
  ): Promise<PaginationResponse<TimeBlocksListResponse>> {
    //returns all the timeBlocks entity with pagination input
    const paginatedResponse: Pagination<TimeBlocksEntity> = await paginate(
      this.timeBlocksRepository,
      paginationRequest,
    );
    //curating a custome response
    const items: Array<TimeBlocksListResponse> = paginatedResponse.items.map(
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

    return { items: items, meta: paginatedResponse.meta };
  }

  async deleteTimeBLock(timeBlockId: string): Promise<SuccessModel> {
    //Searching the given entity with id to delete
    const timeBlocksEntity = await this.timeBlocksRepository.findOne(
      timeBlockId,
    );
    if (!timeBlocksEntity) {
      throw new NotFoundException('No object with provided id found');
    }
    //deleting the found entity
    const deleteBLock = await this.timeBlocksRepository.remove(
      timeBlocksEntity,
    );
    return new SuccessModel();
  }

  async addTimeBlock(
    addTimeBlockRequest: AddTimeBLockRequest,
  ): Promise<SuccessModel> {
    const numberOfTimeBlocks: number = await this.timeBlocksRepository.count({
      where: { status: true },
    });
    //adding constraints to allow adding only a maximum of 5 timeblocks as it affects the design in App
    if (numberOfTimeBlocks == 5) {
      throw new InternalServerErrorException(
        'Maximum 5 timeBlocks allowed. To add new, delete any existing timeblock',
      );
    }
    const timeFromRequest: DateTime = DateTime.fromMillis(
      addTimeBlockRequest.timeFrom,
    );
    const timeToRequest: DateTime = DateTime.fromMillis(
      addTimeBlockRequest.timeTo,
    );
    //adding new time block entity to db
    const timeBlockEntity: TimeBlocksEntity = new TimeBlocksEntity();
    timeBlockEntity.title = addTimeBlockRequest.title;
    timeBlockEntity.timeFrom = timeFromRequest.toJSDate();
    timeBlockEntity.timeTo = timeToRequest.toJSDate();
    await this.timeBlocksRepository.save(timeBlockEntity);
    return new SuccessModel();
  }
}
