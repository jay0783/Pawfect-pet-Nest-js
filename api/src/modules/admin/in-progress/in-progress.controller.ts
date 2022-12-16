import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PaginationRequest } from '@pawfect/models';
import { GetOrderDetailsResponse, GetOrdersResponse } from './models';
import { InProgressService } from './in-progress.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('In-progress')
@Controller('admin/in-progress')
@UseGuards(AuthGuard('admin-jwt'))
export class InProgressController {
  constructor(private readonly inProgressService: InProgressService) {}

  @Get()
  async getInProgressOrders(
    @Query() paginationRequest: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<GetOrdersResponse> {
    const response = await this.inProgressService.getInProgressOrders(
      paginationRequest,
      name,
    );
    return response;
  }

  @Get(':orderId')
  async getInProgressOrderDetails(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<GetOrderDetailsResponse> {
    const response = await this.inProgressService.getInProgressOrderDetails(
      orderId,
    );
    return response;
  }
}
