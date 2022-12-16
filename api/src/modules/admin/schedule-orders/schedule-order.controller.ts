import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScheduleOrderService } from './schedule-order.service';
import {
  GetConfirmedOrderDetailsResponse,
  GetDayScheduleResponse,
  GetOrderMapRequest,
  GetOrderMapResponse,
  GetOrderRequest,
} from './models';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Schedule-Order')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/schedule-orders')
export class ScheduleOrderController {
  constructor(private readonly scheduleOrderService: ScheduleOrderService) {}

  @Get()
  async getOrderMap(
    @Query() queryRequest: GetOrderMapRequest,
  ): Promise<GetOrderMapResponse> {
    const response = await this.scheduleOrderService.getOrderMap(queryRequest);
    return response;
  }

  @Get('all')
  async getAllOrderMap(
    @Query() queryRequest: GetOrderRequest,
  ): Promise<GetDayScheduleResponse> {
    const response = await this.scheduleOrderService.getAllOrderMap(
      queryRequest,
    );
    return response;
  }

  @Get(':orderId')
  async getConfirmedOrderDetails(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<GetConfirmedOrderDetailsResponse> {
    const response = await this.scheduleOrderService.getConfirmedOrderDetails(
      orderId,
    );
    return response;
  }
}
