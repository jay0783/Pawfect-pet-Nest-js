import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { CanceledOrderService } from './canceled-order.service';
import {
  GetCanceledOrdersResponse,
  RefundInfoResponse,
  RefundRequest,
} from './models';

@ApiBearerAuth()
@ApiTags('Cancel/order')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/canceled-orders')
export class CanceledOrderController {
  constructor(private readonly canceledOrderService: CanceledOrderService) {}

  @Get()
  async getCanceledOrders(
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetCanceledOrdersResponse> {
    const response = await this.canceledOrderService.getCanceledOrders(
      paginationRequest,
    );
    return response;
  }

  @Get(':orderId/refund')
  async getRefundInfo(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<RefundInfoResponse> {
    const response = await this.canceledOrderService.getRefundInfo(orderId);
    return response;
  }

  @Post(':orderId')
  async refundOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() refunfRequest: RefundRequest,
  ): Promise<SuccessModel> {
    const response: SuccessModel = await this.canceledOrderService.refundOrder(
      refunfRequest,
      orderId,
    );
    return response;
  }
}
