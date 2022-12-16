import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import {
  CancelNewOrderRequest,
  GetNewOrderDetailsResponse,
  GetNewOrdersResponse,
} from './models';
import { NewOrderService } from './new-order.service';

@ApiBearerAuth()
@ApiTags('New-Orders')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/new-orders')
export class NewOrderController {
  constructor(private readonly newOrderService: NewOrderService) {}

  @Put('confirmed/:days')
  async getNewOrders(
    @Param('days') days: number,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetNewOrdersResponse> {
    const response = await this.newOrderService.getNewOrders(
      paginationRequest,
      days,
    );
    return response;
  }

  @Get(':orderId')
  async getNewOrderDetails(
    @Param('orderId') orderId: string,
  ): Promise<GetNewOrderDetailsResponse> {
    const response = await this.newOrderService.getNewOrderDetails(orderId);
    return response;
  }

  @Post(':orderId/cancel')
  async cancelNewOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() cancelNewOrderRequest: CancelNewOrderRequest,
  ): Promise<SuccessModel> {
    const response = await this.newOrderService.cancelNewOrder(
      orderId,
      cancelNewOrderRequest,
    );
    return response;
  }
}
